/**
 * useForgotPassword
 *
 * ZAŠTO:
 * - izdvaja logiku forgot-password forme iz komponente
 *
 * ŠTA RJEŠAVA:
 * - reusable logika za reset link request
 * - centralizovan error handling
 * - konzistentan pattern kao useLogin/useRegisterCompany
 */

"use client";

import { useState } from "react";
import { validateEmailFormat, validateRequired } from "@/utils/auth/validators";
import apiPublic from "@/utils/api/apiPublic";

type ForgotPasswordErrors = {
  email?: string;
  form?: string;
};

export function useForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<ForgotPasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const clearFormError = () =>
    setErrors((prev) => ({ ...prev, form: "" }));

  const clearFieldError = (field: "email") =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const requiredError = validateRequired(email);
    if (requiredError) {
      setErrors({ email: "Email is required!" });
      return;
    }

    const emailFormatError = validateEmailFormat(email);
    if (emailFormatError) {
      setErrors({ email: "Invalid email format!" });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await apiPublic.post("/users/password-reset/", { email });
      setIsSuccess(true);
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Failed to send reset link.";

      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    errors,
    isSubmitting,
    isSuccess,
    clearFormError,
    clearFieldError,
    handleSubmit,
  };
}
