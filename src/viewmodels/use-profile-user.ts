import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/useAuth";
import type { UserRequest } from "../models/user";
import { updateUserProfile } from "../service/user-service";
import { useFieldErrors } from "./use-field-errors";
import {
  NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  compactErrors,
  sanitizeInput,
  summarizeErrors,
  validateName,
  validatePhone
} from "../utils/form-validation";

type ProfileField = "name" | "lastname" | "phone";

const SUBJECTS = {
  name: "El nombre",
  lastname: "El apellido",
  phone: "El teléfono"
};

export function useProfileViewModel() {
  const { user, updateUser, token } = useAuth();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    lastname: user?.lastname ?? user?.lastName ?? "",
    phone: user?.phone ?? ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const { fieldErrors, reportInputError, replaceFieldErrors } =
    useFieldErrors<ProfileField>();

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        lastname: user.lastname ?? user.lastName ?? "",
        phone: user.phone ?? ""
      });
    }
  }, [user]);

  const handleChange = (field: ProfileField, raw: string) => {
    const { value, error } =
      field === "phone"
        ? sanitizeInput("digits", raw, SUBJECTS.phone, PHONE_MAX_LENGTH)
        : sanitizeInput("letters", raw, SUBJECTS[field], NAME_MAX_LENGTH);

    reportInputError(field, error);
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const submit = async () => {
    if (!user?.id) {
      toast.error("No hay un usuario logueado");
      return;
    }

    const errors = compactErrors<ProfileField>({
      name: validateName(form.name, SUBJECTS.name),
      lastname: validateName(form.lastname, SUBJECTS.lastname),
      phone: validatePhone(form.phone, SUBJECTS.phone)
    });
    replaceFieldErrors(errors);

    const summary = summarizeErrors(errors);

    if (summary) {
      toast.error(summary);
      return;
    }

    try {
      setIsLoading(true);

      const payload: UserRequest = {
        name: form.name.trim(),
        lastname: form.lastname.trim(),
        phone: form.phone
      };

      const response = await updateUserProfile(
        user.id,
        payload,
        token
      );

      updateUser({
        ...user,
        ...response,
        name: response.name ?? form.name,
        lastname: response.lastname ?? form.lastname,
        phone: response.phone ?? form.phone
      });

      toast.success("Perfil actualizado con éxito");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el usuario"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    submit,
    isLoading,
    fieldErrors
  };
}
