"use client";

/**
 * ResetPasswordForm
 *
 * ZAŠTO:
 * - završni korak password reset flow-a
 * - korisnik postavlja novu lozinku putem linka iz emaila
 *
 * ŠTA RJEŠAVA:
 * - omogućava sigurnu promjenu lozinke (uid + token)
 *
 * UX:
 * - isti pattern kao LoginForm (errors object, loading, disabled)
 * - jasna validacija i feedback
 */

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "../Button";
import { ROUTES } from "@/config/routes";
import { validateRequired, validatePasswordComplexity, validateMatch } from "@/utils/auth/validators";
import apiPublic from "@/utils/api/apiPublic";

type ValidationErrors = {
  password?: string;
  password_confirm?: string;
  form?: string;
};

export default function ResetPasswordForm() {
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

  /**
   * SUBMIT
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});

    const passwordError = validateRequired(password) || validatePasswordComplexity(password);
    const confirmError = validateRequired(passwordConfirm);
    const matchError = password && passwordConfirm && !passwordError && !confirmError ? validateMatch(passwordConfirm, password, "Password") : null;

    if (passwordError || confirmError || matchError) {
      setErrors({
        password: passwordError || undefined,
        password_confirm: confirmError || matchError || undefined,
      });
      return;
    }

    try {
      setIsSubmitting(true);

      await apiPublic.post("/users/password-reset-confirm/", {
        uid,
        token,
        new_password: password,
      });

      setIsSuccess(true);

    } catch (err: any) {
      setErrors({
        form:
          err.response?.data?.detail ||
          "Invalid or expired reset link",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">

      {/* BACK */}
      <div className="mb-4 text-center">
        <Link
          href={ROUTES.AUTH.LOGIN}
          className="text-sm text-brand-muted hover:text-brand-accent transition"
        >
          ← Back to login
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
            Set new password
          </h1>

          {!isSuccess && (
            <p className="text-sm text-brand-muted">
              Enter your new password below
            </p>
          )}
        </div>

        {/* SUCCESS */}
        {isSuccess ? (
          <div className="text-center space-y-4">
            <p className="text-sm text-brand-text">
              Your password has been successfully updated.
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
          <form
            onSubmit={handleSubmit}
            className={`space-y-4 ${isSubmitting ? "opacity-80" : ""}`}
            noValidate
          >

            {/* PASSWORD */}
            <input
              type="password"
              autoComplete="new-password"
              placeholder="New password"
              value={password}
              disabled={isSubmitting}
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

            {/* PASSWORD HINT */}
            {!errors.password && (
              <p className="text-xs text-brand-muted">
                Must be at least 8 characters, include uppercase, lowercase,
                number and special character.
              </p>
            )}

            {/* CONFIRM */}
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={passwordConfirm}
              disabled={isSubmitting}
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
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={
                isSubmitting ||
                !password.trim() ||
                !passwordConfirm.trim()
              }
            >
              {isSubmitting ? "Updating..." : "Update New Password"}
            </Button>

            {/* FORM ERROR */}
            {errors.form && (
              <p className="text-sm text-error text-center">
                {errors.form}
              </p>
            )}

          </form>
        )}
      </div>
    </div>
  );
}