/**
 * useLogin
 *
 * ZAŠTO:
 * - izdvaja logiku login forme iz komponente
 *
 * ŠTA RJEŠAVA:
 * - reusable logika za login
 * - centralizovan error handling
 * - konzistentan sa useRegisterCompany pattern-om
 */

"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { validateLoginForm, type ValidationErrors } from "@/utils/auth/validators";

export function useLogin() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const clearFormError = () =>
    setErrors((prev) => ({ ...prev, form: "" }));

  const clearFieldError = (field: "email" | "password") =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password);
      resetForm();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Invalid email or password!";

      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isSubmitting,
    clearFormError,
    clearFieldError,
    handleSubmit,
  };
}