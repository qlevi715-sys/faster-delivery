export const onlyLetters = (value: string) =>
  value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]/g, "");

export const onlyNumbers = (value: string) =>
  value.replace(/\D/g, "");

export const isValidName = (value: string) =>
  /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/.test(value.trim());

export const isValidPhone = (value: string) =>
  /^\d{8,15}$/.test(value);

export const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidDecimal = (value: string) =>
  /^\d+(\.\d{1,2})?$/.test(value);

export const isValidInteger = (value: string) =>
  /^\d+$/.test(value);

export const onlyDecimal = (value: string) =>
  value.replace(/[^0-9.]/g, "").replace(/^(\d*\.\d*).*$/, "$1");