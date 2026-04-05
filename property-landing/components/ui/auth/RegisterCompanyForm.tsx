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

import Link from "next/link";
import Button from "../Button";
import { ROUTES } from "@/config/routes";
import FormInput from "../FormInput";
import { useRegisterCompany } from "@/hooks/useRegisterCompany";


export default function RegisterCompanyForm() {

  // refactor state into hook
  const {
    email,
    setEmail,
    companyName,
    setCompanyName,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,

    errors,
    isSubmitting,
    isSuccess,
    emailExists,

    clearFormError,
    clearFieldError,
    handleSubmit,

  } = useRegisterCompany();


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
                clearFieldError('company_name');
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
                clearFieldError('email');
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
                  clearFieldError('password');
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
                clearFieldError('password_confirm');
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