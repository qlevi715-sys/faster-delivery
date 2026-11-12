import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { FieldErrors } from "../utils/form-validation";

/**
 * Guarda el mensaje de error de cada campo de un formulario para
 * mostrarlo justo debajo del input correspondiente.
 */
export function useFieldErrors<T extends string>() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<T>>({});

  /** Pone el mensaje de un campo; con "" lo quita. */
  const setFieldError = useCallback((field: T, message: string) => {
    setFieldErrors((prev) => {
      if (!message) {
        if (!(field in prev)) return prev;

        const next = { ...prev };
        delete next[field];
        return next;
      }

      return prev[field] === message ? prev : { ...prev, [field]: message };
    });
  }, []);

  /**
   * Para el evento onChange: actualiza el mensaje bajo el campo y, si se
   * rechazó un carácter (ej. un número en un campo de letras), muestra
   * además una notificación. El `id` hace que varias pulsaciones seguidas
   * actualicen la misma notificación en vez de apilar muchas.
   */
  const reportInputError = useCallback(
    (field: T, message: string) => {
      setFieldError(field, message);

      if (message) {
        toast.error(message, { id: `rejected-${field}` });
      }
    },
    [setFieldError]
  );

  /** Reemplaza todos los errores (por ejemplo, al validar al enviar). */
  const replaceFieldErrors = useCallback((errors: FieldErrors<T>) => {
    setFieldErrors(errors);
  }, []);

  return { fieldErrors, setFieldError, reportInputError, replaceFieldErrors };
}
