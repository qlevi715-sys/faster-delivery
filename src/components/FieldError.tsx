interface FieldErrorProps {
  id?: string;
  message?: string;
}

/** Mensaje de error que aparece debajo de un campo; no renderiza nada si no hay error. */
export const FieldError = ({ id, message }: FieldErrorProps) => {
  if (!message) return null;

  return (
    <p id={id} role="alert" className="mt-1 text-xs font-medium text-red-600">
      {message}
    </p>
  );
};
