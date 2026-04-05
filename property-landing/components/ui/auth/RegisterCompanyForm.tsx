"use client";

/**
 * RegisterCompanyForm
 *
 * ZAŠTO:
 * - onboarding nove firme (user + company)
 * - koristi isti UI i UX pattern kao LoginForm
 *
 * ŠTA RJEŠAVA:
 * - konzistentan auth UI
 * - reuse postojećih stilova i komponenti
 *
 * NAPOMENA:
 * - za sada samo validacija + UI
 * - API dolazi kasnije
 */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "../Button";
import { validateRegisterForm } from "@/utils/auth/validators";
import { ROUTES } from "@/config/routes";
import apiPublic from "@/utils/api/apiPublic";
import FormInput from "../FormInput";

type ValidationErrors = {
  email?: string;
  password?: string;
  password_confirm?: string;
  company_name?: string;
  form?: string;
};

export default function RegisterCompanyForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const clearFormError = () =>
    setErrors((prev) => ({ ...prev, form: "" }));

  const resetForm = () => {
    setEmail("");
    setCompanyName("");
    setPassword("");
    setPasswordConfirm("");
  };

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
      setEmailExists(false);
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
      setEmailExists(emailAlreadyExists);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">

      {/* BACK TO HOME */}
      <div className="mb-4 text-center">
        <Link
          href={ROUTES.HOME}
          className="
            text-sm 
            text-brand-muted 
            hover:text-brand-accent 
            transition
          "
        >
          ← Back to home
        </Link>
      </div>

      {/* CARD */}
      <div className="
        bg-brand-surface 
        border border-brand-border 
        rounded-2xl 
        shadow-premium 
        p-8 
        space-y-6
        dark:shadow-none
        dark:ring-1 dark:ring-brand-border
      ">

        {/* TITLE */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-brand-text">
            Register Company  
          </h1>

          <p className="text-sm text-brand-muted">
            Start managing your properties
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* SUCCESS STATE */}
          {isSuccess ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ Registration successful! Redirecting to login...
              </p>
            </div>
          ) : (
            <>

          {/* COMPANY */}
          <FormInput
            type="text"
            placeholder="Company name"
            value={companyName}
            onChange={(e) => {
                setCompanyName(e.target.value);
                setErrors((prev) => ({ ...prev, company_name: undefined }));
            }}
            onFocus={clearFormError}
            error={errors.company_name}
          />

          {/* EMAIL */}
          <FormInput
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            onFocus={clearFormError}
            error={errors.email}
          />

          {/* PASSWORD */}
          <div className="space-y-1">
            <FormInput
              type="password"
              autoComplete="new-password"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              onFocus={clearFormError}
              error={errors.password}
            />
            {!errors.password && (
              <p className="text-xs text-brand-muted">
                  Must be at least 8 characters, include uppercase, lowercase, number and special character.
              </p>
            )}
          </div>

          {/* PASSWORD CONFIRM */}
          <FormInput
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={passwordConfirm}
            onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setErrors((prev) => ({ ...prev, password_confirm: undefined }));
            }}
            onFocus={clearFormError}
            error={errors.password_confirm}
          />

          {/* BUTTON */}
          <Button type="submit" loading={isSubmitting}>
            Register Company
          </Button>

          {errors.form && (
            <p className="text-sm text-error text-center">
              {errors.form}
            </p>
          )}

          {/* LOGIN LINK */}
        <p className="text-sm text-center text-brand-muted">
          Already have an account?{" "}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="text-brand-accent hover:underline"
          >
            Sign in
          </Link>
        </p>

            </>
          )}

        </form>
      </div>
    </div>
  );
}