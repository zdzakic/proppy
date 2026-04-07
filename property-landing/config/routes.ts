/**
 * ROUTES
 *
 * ZAŠTO:
 * - centralno mjesto za sve aplikacione rute
 * - izbjegava hardcoded "/login", "/register", itd.
 *
 * BENEFIT:
 * - refactor na jednom mjestu
 * - nema typo bugova
 */

export const ROUTES = {
  HOME: "/",

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  DASHBOARD: "/dashboard",
};