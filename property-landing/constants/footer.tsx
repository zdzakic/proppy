/**
 * footer.ts
 *
 * Purpose:
 * Centralizes all footer configuration.
 *
 * Why:
 * - No hardcoded values in component
 * - White-label ready
 * - Easy brand switching
 */

export const brandInfo = {
  name: "ROOKerys",
  description:
    "Modern property management platform designed for owners, directors and tenants.",
};

export const institutionalTagline =
  "Independent Governance & Cost Oversight";

export const companyInfo = {
  legalName: "Rookerys Ltd",
  companyNumber: "Company No. XXXXXXXX", // placeholder
  registration: "Registered in England & Wales",
};

export const platformLinks = [
  { label: "Owner Login", href: "/login" },
  { label: "Register", href: "/register" }, // added
  { label: "Features", href: "#features" },
];

export const contactInfo = {
  email: "info@rookerys.com",
  phone: "+44 0000 000000", // placeholder
  location: "United Kingdom", // placeholder
};

export const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export const complianceInfo =
  "GDPR Compliant • Secure Owner Portal";