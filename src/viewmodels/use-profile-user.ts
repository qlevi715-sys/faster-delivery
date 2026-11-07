import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import type { UserRequest } from "../models/user";
import { updateUserProfile } from "../service/user-service";

export function useProfileViewModel() {
  const { user, updateUser, token } = useAuth();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    lastname: user?.lastname ?? user?.lastName ?? "",
    phone: user?.phone ?? ""
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name ?? "",
        lastname: user.lastname ?? user.lastName ?? "",
        phone: user.phone ?? ""
      });
    }
  }, [user]);

  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const submit = async () => {
    if (!user?.id) {
      setError("No hay usuario logeado");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      const payload: UserRequest = {
        name: form.name,
        lastname: form.lastname,
        phone: form.phone
      };

      const updateUserResponse = await updateUserProfile(
        user.id,
        payload,
        token
      );

      updateUser({
        ...user,
        ...updateUserResponse,
        name: updateUserResponse.name ?? form.name,
        lastname: updateUserResponse.lastname ?? form.lastname,
        phone: updateUserResponse.phone ?? form.phone
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