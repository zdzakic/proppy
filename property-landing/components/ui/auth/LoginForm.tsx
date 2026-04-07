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

import Link from "next/link";
import Button from "../Button";
import FormInput from "../FormInput";
import { ROUTES } from "@/config/routes";
import { useLogin } from "@/hooks/useLogin";
import FormError from "../FormError";

export default function LoginForm() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    isSubmitting,
    clearFormError,
    clearFieldError,
    handleSubmit,
  } = useLogin();

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
          <FormInput
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError("email");
            }}
            onFocus={clearFormError}
            error={errors.email}
          />

          {/* PASSWORD */}
            <FormInput
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearFieldError("password");
            }}
            onFocus={clearFormError}
            error={errors.password}
            />

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

          {/* {errors.form && (
            <p className="text-sm text-error text-center">
              {errors.form}
            </p>
          )} */}
          <FormError message={errors.form} />

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