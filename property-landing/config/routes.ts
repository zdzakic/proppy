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

  LANDING: {
    OVERVIEW: "#overview",
    CHALLENGES: "#challenges",
    BETTER_APPROACH: "#better-approach",
    WHO_WE_ARE: "#who-we-are",
  },

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  DASHBOARD: "/dashboard",

  DASHBOARD_PAGES: {
    PROFILE: "/dashboard/profile",
    SETTINGS: "/dashboard/settings",
    COMPANY_ADMIN: {
      COMPANIES: "/dashboard/companies",
      PROPERTIES: "/dashboard/properties",
        OWNERS: "/dashboard/owners",
      USERS: "/dashboard/users",
      HOW_TO_USE: "/dashboard/how-to-use",
    },
    OWNER: {
      PROPERTIES: "/dashboard/properties",
      TENANTS: "/dashboard/tenants",
    },
    TENANT: {
      LEASE: "/dashboard/lease",
      PAYMENTS: "/dashboard/payments",
    },
  },

  LEGAL: {
    PRIVACY: "/privacy",
    TERMS: "/terms",
  },
};