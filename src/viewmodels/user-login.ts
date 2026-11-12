import { useState } from "react";
import { toast } from "sonner";
import { loginUser } from "../service/user-service";
import { useAuth } from "../context/useAuth";
import { useFieldErrors } from "./use-field-errors";
import {
  compactErrors,
  summarizeErrors,
  validateEmail
} from "../utils/form-validation";

type LoginField = "email" | "password";

export function useLoginViewModel() {
  const { login } = useAuth();

  const [email, setEmailValue] = useState("");
  const [password, setPasswordValue] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { fieldErrors, setFieldError, replaceFieldErrors } =
    useFieldErrors<LoginField>();

  const setEmail = (value: string) => {
    setFieldError("email", "");
    setError("");
    setEmailValue(value);
  };

  const setPassword = (value: string) => {
    setFieldError("password", "");
    setError("");
    setPasswordValue(value);
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const errors = compactErrors<LoginField>({
      email: validateEmail(email),
      password: password ? "" : "Completa la contraseña."
    });
    replaceFieldErrors(errors);

    const summary = summarizeErrors(errors);

    if (summary) {
      toast.error(summary);
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser({
        email: email.trim(),
        password
      });

      login(data, true);
      toast.success("Sesión iniciada correctamente");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Credenciales inválidas";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    password,
    setEmail,
    setPassword,
    submit,
    isLoading,
    error,
    fieldErrors
  };
}
