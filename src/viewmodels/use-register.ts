import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { RegisterPayload } from "../models/register";
import { registerUser } from "../service/register-service";
import { useFieldErrors } from "./use-field-errors";
import {
  NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  compactErrors,
  sanitizeInput,
  summarizeErrors,
  validateConfirmPassword,
  validateEmail,
  validateName,
  validatePassword,
  validatePhone
} from "../utils/form-validation";

const initialForm: RegisterPayload = {
  name: "",
  lastname: "",
  phone: "",
  email: "",
  password: ""
};

type RegisterField = keyof RegisterPayload | "confirmPassword";

const SUBJECTS = {
  name: "El nombre",
  lastname: "El apellido",
  phone: "El teléfono"
};

// Bloquea los caracteres no permitidos según el campo y devuelve el mensaje si hubo rechazo.
const filterField = (field: keyof RegisterPayload, raw: string) => {
  if (field === "name" || field === "lastname") {
    return sanitizeInput("letters", raw, SUBJECTS[field], NAME_MAX_LENGTH);
  }

  if (field === "phone") {
    return sanitizeInput("digits", raw, SUBJECTS.phone, PHONE_MAX_LENGTH);
  }

  return { value: raw, error: "" };
};

export function useRegisterViewModel(onSuccess?: () => void) {
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fieldErrors, setFieldError, reportInputError, replaceFieldErrors } =
    useFieldErrors<RegisterField>();

  const handleChange = (field: keyof RegisterPayload, raw: string) => {
    const { value, error } = filterField(field, raw);

    reportInputError(field, error);
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleConfirmPasswordChange = (value: string) => {
    setFieldError("confirmPassword", "");
    setConfirmPassword(value);
  };

  const validate = () =>
    compactErrors<RegisterField>({
      name: validateName(form.name, SUBJECTS.name),
      lastname: validateName(form.lastname, SUBJECTS.lastname),
      email: validateEmail(form.email),
      phone: validatePhone(form.phone, SUBJECTS.phone),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, confirmPassword)
    });

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validate();
    replaceFieldErrors(errors);

    const summary = summarizeErrors(errors);

    if (summary) {
      toast.error(summary);
      return;
    }

    setIsLoading(true);

    try {
      await registerUser({
        ...form,
        name: form.name.trim(),
        lastname: form.lastname.trim(),
        email: form.email.trim()
      });

      toast.success("Cuenta creada correctamente. Ya puedes iniciar sesión.");
      setForm(initialForm);
      setConfirmPassword("");
      onSuccess?.();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Error al registrar usuario"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    confirmPassword,
    handleConfirmPasswordChange,
    isLoading,
    fieldErrors,
    handleChange,
    submit
  };
}
