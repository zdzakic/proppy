"use client";

/**
 * LoginForm
 *
 * ZAŠTO:
 * Login forma predstavlja centralni UI element
 * authentication stranice.
 *
 * Dizajn koristi postojeće brand tokene iz globals.css
 * kako bi login bio vizuelno usklađen sa landing stranicom.
 *
 * Odgovornosti:
 * - prikupljanje email i password inputa
 * - submit autentifikacije
 * - prikaz loading state-a
 */

import { useState } from "react";
import Link from "next/link";
import { validateLoginForm, type ValidationErrors } from "@/utils/auth/validators";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Spinner from "../Spinner";
import Button from "../Button";
import {ROUTES} from "@/config/routes";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    };

const clearFormError = () =>
  setErrors((prev) => ({ ...prev, form: "" }));

  /**
   * FORM SUBMIT
   *
   * Šta radi:
   * - validira login formu
   * - postavlja errors state
   *
   * Zašto:
   * - LoginForm ne treba znati detalje validacije
   */
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const validationErrors = validateLoginForm(email, password);

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  // login() 
   try {
    setIsSubmitting(true);
   await login(email, password);  
    resetForm();

  } catch (error: any) {

      const message =
        error.response?.data?.detail ||
        "Invalid email or password!";

    // toast.error(message);
    setErrors({
        form: message,
    });

    // resetForm();

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

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-brand-text">
            Sign in
          </h1>

          <p className="text-sm text-brand-muted">
            Access your dashboard
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>

          {/* EMAIL */}
          <input
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            // onChange={(e) => setEmail(e.target.value)}
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
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            // onChange={(e) => setPassword(e.target.value)}
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

            {/* FORGOT PASSWORD */}
          <div className="flex justify-end">
            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="
                text-sm 
                text-brand-muted 
                hover:text-brand-accent 
                transition
              "
            >
              Forgot password?
            </Link>
          </div>
         

          {/* BUTTON */}
          <Button type="submit" loading={isSubmitting}>
            Sign in
          </Button>

          {errors.form && (
            <p className="text-sm text-error text-center">
              {errors.form}
            </p>
          )}

          {/* REGISTER */}
        <p className="text-sm text-center text-brand-muted">
          Don’t have an account?{" "}
          <Link
            href={ROUTES.AUTH.REGISTER}
            className="text-brand-accent hover:underline"
          >
            Create one
          </Link>
        </p>


        </form>

      </div>

    </div>
  );
}