/**
 * validateRequired
 *
 * Šta radi:
 * - provjerava da li je polje prazno
 *
 * Zašto postoji:
 * - reusable validator za sve forme
 *
 * Problem koji rješava:
 * - dupliranje provjere praznih polja
 */
export function validateRequired(value: string): string | null {
  if (!value || !value.trim()) {
    return "This field is required";
  }

  return null;
}


/**
 * validateEmailFormat
 *
 * Šta radi:
 * - provjerava osnovni email format
 *
 * Zašto postoji:
 * - login i register koriste isti validator
 *
 * Problem koji rješava:
 * - email provjera ne mora biti u komponenti
 */
export function validateEmailFormat(email: string): string | null {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!re.test(email)) {
    return "Invalid email format";
  }

  return null;
}

// validation types
export type ValidationErrors = Record<string, string>;

/**
 * validateLoginForm
 *
 * Šta radi:
 * - validira login formu
 *
 * Zašto postoji:
 * - LoginForm ne treba znati validaciona pravila
 *
 * Problem koji rješava:
 * - validacija ostaje centralizovana
 */
export function validateLoginForm(
  email: string,
  password: string
): ValidationErrors {

  const errors: ValidationErrors = {};

  const emailRequired = validateRequired(email);
  if (emailRequired) errors.email = emailRequired;

  const emailFormat = !emailRequired ? validateEmailFormat(email) : null;
  if (emailFormat) errors.email = emailFormat;

  const passwordRequired = validateRequired(password);
  if (passwordRequired) errors.password = passwordRequired;

  return errors;
}