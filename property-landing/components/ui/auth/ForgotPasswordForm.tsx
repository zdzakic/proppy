"use client";

/**
 * ForgotPasswordForm
 *
 * ZAŠTO:
 * - omogućava korisniku da resetuje lozinku
 * - dio kompletnog auth flow-a (login / register / reset)
 *
 * ŠTA RJEŠAVA:
 * - korisnik koji zaboravi password ne blokira onboarding
 *
 * NAPOMENA:
 * - trenutno samo UI + validacija
 * - API integracija dolazi kasnije
 */

import Link from "next/link";
import Button from "../Button";
import { ROUTES } from "@/config/routes";
import FieldError from "../FieldError";
import FormError from "../FormError";
import { useForgotPassword } from "@/hooks/useForgotPassword";

export default function ForgotPasswordForm() {
  const {
    email,
    setEmail,
    errors,
    isSubmitting,
    isSuccess,
    clearFormError,
    clearFieldError,
    handleSubmit,
  } = useForgotPassword();

  return (
    <div className="w-full max-w-md">

      {/* BACK TO HOME */}
      <div className="mb-4 text-center">
        <Link
          href={ROUTES.HOME}
          className="text-sm text-brand-muted hover:text-brand-accent transition"
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
            Reset password
          </h1>

          {!isSuccess && (
            <p className="text-sm text-brand-muted">
              Enter your email to receive reset link
            </p>
          )}
        </div>

        {/* SUCCESS STATE */}
        {isSuccess ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-brand-text">
              If an account exists, you will receive a reset link.
            </p>

            <Link
              href={ROUTES.AUTH.LOGIN}
              className="text-brand-accent hover:underline text-sm"
            >
              Back to login
            </Link>
          </div>
        ) : (

          /* FORM */
          <form onSubmit={handleSubmit} 
          className={`space-y-4 ${isSubmitting ? "opacity-80" : ""}`}
          noValidate>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError("email");
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

            <FieldError message={errors.email} />

            <Button
              type="submit"
              loading={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>

            <FormError message={errors.form} />

            {/* LOGIN LINK */}
            <p className="text-sm text-center text-brand-muted">
              {/* Remember your password?{" "} */}
              <Link
                href={ROUTES.AUTH.LOGIN}
                className="text-brand-accent hover:underline"
              >
                Sign in
              </Link>
            </p>

          </form>
        )}
      </div>
    </div>
  );
}