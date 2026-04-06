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
 */

import Link from "next/link";
import Button from "../Button";
import FormInput from "../FormInput";
import { ROUTES } from "@/config/routes";
import { useResetPassword } from "@/hooks/useResetPassword";

export default function ResetPasswordForm() {
  const {
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
  } = useResetPassword();

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
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              ✓ Your password has been successfully updated.
            </p>

            <Link
              href={ROUTES.AUTH.LOGIN}
              className="text-brand-accent hover:underline text-sm"
            >
              Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* PASSWORD */}
            <div className="space-y-1">
              <FormInput
                type="password"
                autoComplete="new-password"
                placeholder="New password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError("password");
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

            {/* CONFIRM PASSWORD */}
            <FormInput
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value);
                clearFieldError("password_confirm");
              }}
              onFocus={clearFormError}
              error={errors.password_confirm}
            />

            {/* BUTTON */}
            <Button
              type="submit"
              loading={isSubmitting}
            >
              Update New Password
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