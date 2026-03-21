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
    return "This field is required!";
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
    return "Invalid email format!";
  }

  return null;
}

/**
 * validatePasswordComplexity
 *
 * Šta radi:
 * - provjerava kompleksnost lozinke
 * - minimalno 8 karaktera, jedno veliko slovo, jedno malo slovo, broj i specijalan karakter
 */
export function validatePasswordComplexity(password: string): string | null {
  if (password.length < 8) {
    return "Password must be at least 8 characters long!";
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    return "Password must include uppercase, lowercase, number, and special character!";
  }

  return null;
}

/**
 * validateMatch
 *
 * Šta radi:
 * - provjerava da li se dva polja podudaraju (npr. email confirmation ili password confirmation)
 */
export function validateMatch(
  value: string,
  matchValue: string,
  fieldName: string
): string | null {
  if (value !== matchValue) {
    return `${fieldName} confirmation does not match!`;
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

  const emailError =
    validateRequired(email) || validateEmailFormat(email);

  if (emailError) {
    errors.email =
      emailError === "This field is required!"
        ? "Email is required!"
        : emailError;
  }

  const passwordError = validateRequired(password);
  if (passwordError) {
    errors.password = "Password is required!";
  }

  return errors;
}

/**
 * Register form validation
 *
 * ZAŠTO:
 * - prati isti pattern kao login validator
 * - centralizuje validaciju
 *
 * ŠTA RJEŠAVA:
 * - dupliranje logike u komponentama
 * - nekonzistentne error poruke
 */
export function validateRegisterForm(
  email: string,
  password: string,
  passwordConfirm: string,
  companyName: string
) {
  const errors: Record<string, string> = {};

  if (!email) {
    errors.email = "Email is required";
  } else if (!email.includes("@")) {
    errors.email = "Invalid email";
  }

  if (!companyName) {
    errors.company_name = "Company name is required";
  }

  if (!password) {
    errors.password = "Password is required";
  }

  if (!passwordConfirm) {
    errors.password_confirm = "Confirm your password";
  }

  if (password && passwordConfirm && password !== passwordConfirm) {
    errors.password_confirm = "Passwords do not match";
  }

  return errors;
}