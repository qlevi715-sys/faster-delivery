import { useState, type FormEvent } from "react";
import type { RegisterPayload } from "../models/register";
import { registerUser } from "../service/register-service";
import {
  onlyLetters,
  onlyNumbers,
  isValidName,
  isValidPhone,
  isValidEmail
} from "../utils/form-validation";

const initialForm: RegisterPayload = {
  name: "",
  lastname: "",
  phone: "",
  email: "",
  password: ""
};

export function useRegisterViewModel() {
  const [form, setForm] = useState<RegisterPayload>(initialForm);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (field: keyof RegisterPayload, value: string) => {
    setError("");

    if (field === "name" || field === "lastname") {
      value = onlyLetters(value);
    }

    if (field === "phone") {
      value = onlyNumbers(value).slice(0, 15);
    }

    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const validate = () => {
    if (
      !form.name.trim() ||
      !form.lastname.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.password ||
      !confirmPassword
    ) {
      return "Completa todos los campos";
    }

    if (!isValidName(form.name) || !isValidName(form.lastname)) {
      return "El nombre y apellido solo deben contener letras";
    }

    if (!isValidPhone(form.phone)) {
      return "El teléfono debe contener entre 8 y 15 números";
    }

    if (!isValidEmail(form.email)) {
      return "Ingresa un correo electrónico válido";
    }

    if (form.password.length < 6) {
      return "La contraseña debe tener al menos 6 caracteres";
    }

    if (form.password !== confirmPassword) {
      return "Las contraseñas no coinciden";
    }

    return "";
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    const validationMessage = validate();

    if (validationMessage) {
      setError(validationMessage);
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

      setSuccess("Usuario registrado correctamente");
      setForm(initialForm);
      setConfirmPassword("");
    } catch (error) {
      setError(
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
    setConfirmPassword,
    isLoading,
    error,
    handleChange,
    success,
    submit
  };
}