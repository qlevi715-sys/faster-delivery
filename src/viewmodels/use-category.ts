import { useCallback, useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/useAuth";
import type { CategoryPayload, CategoryResponse } from "../models/category";
import { createCategory, getCategories } from "../service/category-service";
import { useFieldErrors } from "./use-field-errors";
import {
  NAME_MAX_LENGTH,
  compactErrors,
  sanitizeInput,
  summarizeErrors,
  validateName,
  validateRequiredText
} from "../utils/form-validation";

type CategoryField = keyof CategoryPayload;

const SUBJECTS = {
  name: "El nombre de la categoría",
  description: "La descripción"
};

export function useCategoryViewModel(onSuccessCallback?: () => void) {
  const { token } = useAuth();

  const [form, setForm] = useState<CategoryPayload>({
    name: "",
    description: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  // Solo errores al CARGAR la lista de categorías (los de enviar el formulario salen como toast).
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const { fieldErrors, reportInputError, replaceFieldErrors } =
    useFieldErrors<CategoryField>();

  const handleChange = (field: CategoryField, raw: string) => {
    let value = raw;
    let message = "";

    if (field === "name") {
      const result = sanitizeInput("letters", raw, SUBJECTS.name, NAME_MAX_LENGTH);
      value = result.value;
      message = result.error;
    }

    reportInputError(field, message);
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = compactErrors<CategoryField>({
      name: validateName(form.name, SUBJECTS.name),
      description: validateRequiredText(form.description, SUBJECTS.description)
    });
    replaceFieldErrors(errors);

    const summary = summarizeErrors(errors);

    if (summary) {
      toast.error(summary);
      return;
    }

    try {
      setIsLoading(true);

      await createCategory(
        {
          name: form.name.trim(),
          description: form.description.trim()
        },
        token
      );

      toast.success("Categoría creada con éxito");
      setForm({ name: "", description: "" });

      onSuccessCallback?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo crear la categoría"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = useCallback(async () => {
    if (!token) return;

    try {
      const data = await getCategories(token);
      setCategories(data);
      setError("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Error al cargar las categorías"
      );
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    form,
    handleChange,
    submit,
    isLoading,
    error,
    fieldErrors,
    categories,
    refreshCategories: fetchCategories
  };
}
