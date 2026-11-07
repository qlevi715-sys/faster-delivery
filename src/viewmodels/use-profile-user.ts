import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import type { UserRequest } from "../models/user";
import { updateUserProfile } from "../service/user-service";
import {
  onlyLetters,
  onlyNumbers,
  isValidName,
  isValidPhone
} from "../utils/form-validation";

export function useProfileViewModel() {
  const { user, updateUser, token } = useAuth();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    lastname: user?.lastname ?? user?.lastName ?? "",
    phone: user?.phone ?? ""
  });

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        lastname: user.lastname ?? user.lastName ?? "",
        phone: user.phone ?? ""
      });
    }
  }, [user]);

  const handleChange = (
    field: keyof typeof form,
    value: string
  ) => {
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

  const submit = async () => {
    setError("");
    setSuccess("");

    if (!user?.id) {
      setError("No hay un usuario logueado");
      return;
    }

    if (!form.name.trim() || !form.lastname.trim() || !form.phone.trim()) {
      setError("Completa todos los campos");
      return;
    }

    if (!isValidName(form.name) || !isValidName(form.lastname)) {
      setError("El nombre y apellido solo deben contener letras");
      return;
    }

    if (!isValidPhone(form.phone)) {
      setError("El teléfono debe contener entre 8 y 15 números");
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

      setSuccess("Perfil actualizado con éxito");
    } catch (error) {
      setError(
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
    error,
    success
  };
}