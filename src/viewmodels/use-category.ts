import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../context/useAuth";
import type { CategoryPayload, CategoryResponse } from "../models/category";
import { createCategory, getCategories } from "../service/category-service";
import {
  onlyLetters,
  isValidName
} from "../utils/form-validation";

export function useCategoryViewModel(onSuccessCallback?: () => void) {
  const { token } = useAuth();

  const [form, setForm] = useState<CategoryPayload>({
    name: "",
    description: ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState<CategoryResponse[]>([]);

  const handleChange = (field: keyof CategoryPayload, value: string) => {
    setError("");

    if (field === "name") {
      value = onlyLetters(value);
    }

    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.description.trim()) {
      setError("Completa todos los campos");
      return;
    }

    if (!isValidName(form.name)) {
      setError("El nombre de la categoría solo debe contener letras");
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

      setSuccess("Categoría creada con éxito");
      setForm({ name: "", description: "" });

      onSuccessCallback?.();
    } catch (error) {
      setError(
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
    success,
    categories,
    refreshCategories: fetchCategories
  };
}