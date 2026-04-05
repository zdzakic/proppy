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

import { useState } from "react";
import Link from "next/link";
import Button from "../Button";
import { ROUTES } from "@/config/routes";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      // 👉 API ide kasnije
      console.log("Reset link sent to:", email);

      setIsSuccess(true);

    } catch (err: any) {
      setError("Something went wrong");
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

          <p className="text-sm text-brand-muted">
            Enter your email to receive reset link
          </p>
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
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
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
                  error
                    ? "border-error focus:ring-error/30"
                    : "border-brand-border focus:ring-brand-accent"
                }
              `}
            />

            {error && (
              <p className="text-sm text-error">
                {error}
              </p>
            )}

            <Button
              type="submit"
              loading={isSubmitting}
              disabled={!email}
            >
              Send Reset Link
            </Button>

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