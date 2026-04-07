/**
 * useRegisterCompany
 *
 * ZAŠTO:
 * - izdvaja logiku registracije kompanije iz komponente
 *
 * ŠTA RJEŠAVA:
 * - reusable logika za registraciju
 * - konzistentan error handling
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import apiPublic from "@/utils/api/apiPublic";
import { validateRegisterForm } from "@/utils/auth/validators";
import { ROUTES } from "@/config/routes";

type ValidationErrors = {
  email?: string;
  password?: string;
  password_confirm?: string;
  company_name?: string;
  form?: string;
};


export function useRegisterCompany() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const clearFormError = () =>
    setErrors((prev) => ({ ...prev, form: "" }));

  const clearFieldError = (field: keyof ValidationErrors) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const isEmailAlreadyRegisteredError = (message: string) => {
    const normalized = String(message).toLowerCase();
    return /email.*(exists|already|registered)|already.*registered|user.*exists/.test(normalized);
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(email, password, passwordConfirm, companyName);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors as ValidationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await apiPublic.post("/users/register-company/", {
        email,
        company_name: companyName,
        password,
        password_confirm: passwordConfirm,
      });

      setIsSuccess(true);

      // Redirektuj na login nakon 2 sekunde
      setTimeout(() => {
        router.push(ROUTES.AUTH.LOGIN);
      }, 3000);

    } catch (error: any) {
      const responseData = error?.response?.data || {};
      const rawMessage =
        responseData.detail ||
        responseData.message ||
        (Array.isArray(responseData.email) ? responseData.email[0] : responseData.email) ||
        "";

      const emailAlreadyExists = isEmailAlreadyRegisteredError(rawMessage);

      setErrors({
        form: emailAlreadyExists
          ? "Email already exists. Sign in to add another company from your account."
          : rawMessage || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    companyName,
    setCompanyName,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,

    errors,
    isSubmitting,
    isSuccess,

    clearFormError,
    clearFieldError,
    handleSubmit,
  };
}