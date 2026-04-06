/**
 * useResetPassword
 *
 * ZAŠTO:
 * - izdvaja logiku password reset forme iz komponente
 *
 * ŠTA RJEŠAVA:
 * - reusable logika za reset lozinke
 * - centralizovan error handling
 * - konzistentan sa useRegisterCompany i useLogin pattern-om
 */

"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { validateRequired, validatePasswordComplexity, validateMatch } from "@/utils/auth/validators";
import apiPublic from "@/utils/api/apiPublic";

type ValidationErrors = {
  password?: string;
  password_confirm?: string;
  form?: string;
};

export function useResetPassword() {
  const params = useParams();
  const uid = params?.uid as string;
  const token = params?.token as string;

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const clearFormError = () =>
    setErrors((prev) => ({ ...prev, form: "" }));

  const clearFieldError = (field: "password" | "password_confirm") =>
    setErrors((prev) => ({ ...prev, [field]: "" }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordError = validateRequired(password) || validatePasswordComplexity(password);
    const confirmError = validateRequired(passwordConfirm);
    const matchError = password && passwordConfirm && !passwordError && !confirmError 
      ? validateMatch(passwordConfirm, password, "Password") 
      : null;

    if (passwordError || confirmError || matchError) {
      setErrors({
        password: passwordError || undefined,
        password_confirm: confirmError || matchError || undefined,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await apiPublic.post("/users/password-reset-confirm/", {
        uid,
        token,
        new_password: password,
      });

      setIsSuccess(true);
    } catch (err: unknown) {
      const message = 
        (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
        "Invalid or expired reset link";

      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
