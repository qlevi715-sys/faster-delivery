// =====================================================================
// Utilidades de validación compartidas por todos los formularios.
//
//  - Filtros (onlyLetters, onlyNumbers, onlyDecimal): bloquean los
//    caracteres no permitidos mientras el usuario escribe.
//  - sanitizeInput: aplica el filtro Y devuelve un mensaje de error
//    claro cuando se rechazó algún carácter (para mostrarlo bajo el campo).
//  - validateXxx: validan el valor completo antes de enviar el formulario.
// =====================================================================

export const NAME_MAX_LENGTH = 50;
export const PRODUCT_NAME_MAX_LENGTH = 80;
export const PHONE_MIN_LENGTH = 8;
export const PHONE_MAX_LENGTH = 15;
export const SKU_MIN_LENGTH = 4;
export const SKU_MAX_LENGTH = 20;
export const STOCK_MAX_LENGTH = 9;
export const PASSWORD_MIN_LENGTH = 6;

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

// ---------------------------------------------------------------------
// Filtros
// ---------------------------------------------------------------------

export const onlyLetters = (value: string) =>
  value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "");

export const onlyNumbers = (value: string) =>
  value.replace(/\D/g, "");

/** Solo dígitos y un único punto decimal, con máximo 2 decimales. */
export const onlyDecimal = (value: string) => {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const [integer, ...decimals] = cleaned.split(".");

  if (decimals.length === 0) return integer;

  return `${integer || "0"}.${decimals.join("").slice(0, 2)}`;
};

export const hasNonLetters = (value: string) =>
  /[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/.test(value);

export const hasNonDigits = (value: string) => /\D/.test(value);

// ---------------------------------------------------------------------
// Comprobaciones booleanas
// ---------------------------------------------------------------------

export const isValidName = (value: string) =>
  /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(value.trim()) &&
  /[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(value);

export const isValidPhone = (value: string) =>
  new RegExp(`^\\d{${PHONE_MIN_LENGTH},${PHONE_MAX_LENGTH}}$`).test(value);

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidDecimal = (value: string) =>
  /^\d+(\.\d{1,2})?$/.test(value);

export const isValidInteger = (value: string) =>
  /^\d+$/.test(value);

// ---------------------------------------------------------------------
// Mensajes
// ---------------------------------------------------------------------

const lowerFirst = (text: string) =>
  text.charAt(0).toLowerCase() + text.slice(1);

const requiredMessage = (subject: string) =>
  `Completa ${lowerFirst(subject)}.`;

const lettersOnlyMessage = (subject: string) =>
  `${subject} solo puede contener letras. No se permiten números ni símbolos.`;

const digitsOnlyMessage = (subject: string) =>
  `${subject} solo puede contener números. No se permiten letras ni símbolos.`;

const decimalCharsMessage = (subject: string) =>
  `${subject} solo puede contener números (ejemplo: 12.50). No se permiten letras ni símbolos.`;

// ---------------------------------------------------------------------
// Filtro + mensaje (para el evento onChange)
// ---------------------------------------------------------------------

export type InputKind = "letters" | "digits" | "decimal" | "text";

export interface SanitizedInput {
  /** Valor ya filtrado, listo para guardarse en el estado. */
  value: string;
  /** Mensaje si se rechazó algún carácter; cadena vacía si todo fue válido. */
  error: string;
}

export function sanitizeInput(
  kind: InputKind,
  raw: string,
  subject: string,
  maxLength?: number
): SanitizedInput {
  let value = raw;
  let error = "";

  switch (kind) {
    case "letters":
      value = onlyLetters(raw);
      if (hasNonLetters(raw)) error = lettersOnlyMessage(subject);
      break;

    case "digits":
      value = onlyNumbers(raw);
      if (hasNonDigits(raw)) error = digitsOnlyMessage(subject);
      break;

    case "decimal": {
      value = onlyDecimal(raw);

      const [, decimals = ""] = raw.split(".");

      if (/[^0-9.]/.test(raw)) {
        error = decimalCharsMessage(subject);
      } else if ((raw.match(/\./g) ?? []).length > 1) {
        error = `${subject} solo admite un punto decimal (ejemplo: 12.50).`;
      } else if (decimals.length > 2) {
        error = `${subject} admite como máximo dos decimales (ejemplo: 12.50).`;
      }
      break;
    }

    case "text":
      break;
  }

  if (maxLength !== undefined && value.length > maxLength) {
    value = value.slice(0, maxLength);

    if (!error) {
      const unit = kind === "digits" ? "dígitos" : "caracteres";
      error = `${subject} admite como máximo ${maxLength} ${unit}.`;
    }
  }

  return { value, error };
}

// ---------------------------------------------------------------------
// Validadores (devuelven "" si es válido, o el mensaje de error)
// ---------------------------------------------------------------------

export const validateRequiredText = (value: string, subject: string) =>
  value.trim() ? "" : requiredMessage(subject);

export function validateName(value: string, subject: string) {
  if (!value.trim()) return requiredMessage(subject);
  if (hasNonLetters(value)) return lettersOnlyMessage(subject);
  if (!isValidName(value)) return `${subject} debe contener al menos una letra.`;

  if (value.trim().length > NAME_MAX_LENGTH) {
    return `${subject} admite como máximo ${NAME_MAX_LENGTH} caracteres.`;
  }

  return "";
}

/** Los productos pueden llevar números ("Combo 2x1"), pero no ser solo números o símbolos. */
export function validateProductName(value: string, subject: string) {
  if (!value.trim()) return requiredMessage(subject);

  if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ]/.test(value)) {
    return `${subject} debe contener letras (no puede ser solo números o símbolos).`;
  }

  if (value.trim().length > PRODUCT_NAME_MAX_LENGTH) {
    return `${subject} admite como máximo ${PRODUCT_NAME_MAX_LENGTH} caracteres.`;
  }

  return "";
}

export function validatePhone(value: string, subject = "El teléfono") {
  if (!value.trim()) return requiredMessage(subject);
  if (hasNonDigits(value)) return digitsOnlyMessage(subject);

  if (!isValidPhone(value)) {
    return `${subject} debe tener entre ${PHONE_MIN_LENGTH} y ${PHONE_MAX_LENGTH} dígitos.`;
  }

  return "";
}

export function validateEmail(value: string) {
  if (!value.trim()) return "Completa el correo electrónico.";

  if (!isValidEmail(value)) {
    return "Ingresa un correo válido, por ejemplo: nombre@correo.com.";
  }

  return "";
}

export function validatePassword(value: string) {
  if (!value) return "Completa la contraseña.";

  if (value.length < PASSWORD_MIN_LENGTH) {
    return `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }

  return "";
}

export function validateConfirmPassword(password: string, confirm: string) {
  if (!confirm) return "Confirma tu contraseña.";
  if (password !== confirm) return "Las contraseñas no coinciden.";

  return "";
}

export function validateSku(value: string, subject: string) {
  if (!value.trim()) return requiredMessage(subject);
  if (hasNonDigits(value)) return digitsOnlyMessage(subject);

  if (value.length < SKU_MIN_LENGTH || value.length > SKU_MAX_LENGTH) {
    return `${subject} debe tener entre ${SKU_MIN_LENGTH} y ${SKU_MAX_LENGTH} dígitos.`;
  }

  return "";
}

export function validatePrice(
  value: string,
  subject: string,
  { allowZero = false }: { allowZero?: boolean } = {}
) {
  if (!value.trim()) return requiredMessage(subject);
  if (/[^0-9.]/.test(value)) return decimalCharsMessage(subject);

  if (!isValidDecimal(value)) {
    return `${subject} debe ser un número válido con máximo dos decimales (ejemplo: 12.50).`;
  }

  if (!allowZero && Number(value) <= 0) {
    return `${subject} debe ser mayor que cero.`;
  }

  return "";
}

export function validateWholeNumber(value: string, subject: string) {
  if (!value.trim()) return requiredMessage(subject);
  if (hasNonDigits(value)) return digitsOnlyMessage(subject);

  return "";
}

// ---------------------------------------------------------------------
// Manejo de varios errores a la vez
// ---------------------------------------------------------------------

/** Quita los campos sin error, dejando solo los que tienen mensaje. */
export function compactErrors<T extends string>(
  errors: Record<T, string>
): FieldErrors<T> {
  const result: FieldErrors<T> = {};

  (Object.keys(errors) as T[]).forEach((field) => {
    if (errors[field]) result[field] = errors[field];
  });

  return result;
}

/**
 * Texto para el toast al enviar: el mensaje exacto si hay un solo error,
 * o un resumen si hay varios (el detalle queda bajo cada campo).
 * Devuelve "" si no hay errores.
 */
export function summarizeErrors(errors: Partial<Record<string, string>>) {
  const messages = Object.values(errors).filter((m): m is string => Boolean(m));

  if (messages.length === 0) return "";
  if (messages.length === 1) return messages[0];

  return `Hay ${messages.length} campos con errores. Revísalos antes de continuar.`;
}
