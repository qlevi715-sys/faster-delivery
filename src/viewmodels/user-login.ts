import { useState } from "react";
import { loginUser } from "../service/user-service";
import { useAuth } from "../context/useAuth";
import { isValidEmail } from "../utils/form-validation";

export function useLoginViewModel() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Completa correo y contraseña");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Ingresa un correo electrónico válido");
      return;
    }

    setIsLoading(true);

    try {
      const data = await loginUser({
        email: email.trim(),
        password
      });

      login(data, true);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Credenciales inválidas"
      );
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
    error
  };
}