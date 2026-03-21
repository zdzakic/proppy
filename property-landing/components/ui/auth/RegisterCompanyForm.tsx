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
import Button from "../Button";

type ValidationErrors = {
  email?: string;
  password?: string;
  password_confirm?: string;
  company_name?: string;
  form?: string;
};

export default function RegisterCompanyForm() {
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearFormError = () =>
    setErrors((prev) => ({ ...prev, form: "" }));

  const resetForm = () => {
    setEmail("");
    setCompanyName("");
    setPassword("");
    setPasswordConfirm("");
  };

  const validate = () => {
    const newErrors: ValidationErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Invalid email";
    }

    if (!companyName) {
      newErrors.company_name = "Company name is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (!passwordConfirm) {
      newErrors.password_confirm = "Confirm your password";
    }

    if (password && passwordConfirm && password !== passwordConfirm) {
      newErrors.password_confirm = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      // 👉 za sada samo debug
      console.log({
        email,
        company_name: companyName,
        password,
      });

      resetForm();

    } catch (error: any) {
      setErrors({
        form: "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">

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

          {/* COMPANY */}
          <input
            type="text"
            placeholder="Company name"
            value={companyName}
            onChange={(e) => {
                setCompanyName(e.target.value);
                setErrors((prev) => ({ ...prev, company_name: "" }));
            }}
            onFocus={clearFormError}
            className={`
                w-full
                border
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-1
                bg-transparent
                text-brand-text
                placeholder:text-brand-muted
                ${
                errors.company_name
                    ? "border-error focus:ring-error/30"
                    : "border-brand-border focus:ring-brand-accent"
                }
            `}
            />
          {errors.company_name && (
            <p className="text-sm text-error mt-1">
              {errors.company_name}
            </p>
          )}

          {/* EMAIL */}
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
                setEmail(e.target.value);
                setErrors((prev) => ({ ...prev, email: "" }));
            }}
            onFocus={clearFormError}
            className={`
                w-full
                border
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-1
                bg-transparent
                text-brand-text
                placeholder:text-brand-muted
                ${
                errors.email
                    ? "border-error focus:ring-error/30"
                    : "border-brand-border focus:ring-brand-accent"
                }
            `}
            />
          {errors.email && (
            <p className="text-sm text-error mt-1">
              {errors.email}
            </p>
          )}

          {/* PASSWORD */}
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
                setPassword(e.target.value);
                setErrors((prev) => ({ ...prev, password: "" }));
            }}
            onFocus={clearFormError}
            className={`
                w-full
                border
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-1
                bg-transparent
                text-brand-text
                placeholder:text-brand-muted
                ${
                errors.password
                    ? "border-error focus:ring-error/30"
                    : "border-brand-border focus:ring-brand-accent"
                }
            `}
            />
          {errors.password && (
            <p className="text-sm text-error mt-1">
              {errors.password}
            </p>
          )}

          {/* CONFIRM PASSWORD */}
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={passwordConfirm}
            onChange={(e) => {
                setPasswordConfirm(e.target.value);
                setErrors((prev) => ({ ...prev, password_confirm: "" }));
            }}
            onFocus={clearFormError}
            className={`
                w-full
                border
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-1
                bg-transparent
                text-brand-text
                placeholder:text-brand-muted
                ${
                errors.password_confirm
                    ? "border-error focus:ring-error/30"
                    : "border-brand-border focus:ring-brand-accent"
                }
            `}
            />
          {errors.password_confirm && (
            <p className="text-sm text-error mt-1">
              {errors.password_confirm}
            </p>
          )}

          {/* BUTTON */}
          <Button type="submit" loading={isSubmitting}>
            Create account
          </Button>

          {errors.form && (
            <p className="text-sm text-error text-center">
              {errors.form}
            </p>
          )}

        </form>
      </div>
    </div>
  );
}