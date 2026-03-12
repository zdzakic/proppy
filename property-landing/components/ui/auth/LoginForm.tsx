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
import { validateRequired, validateEmailFormat } from "@/utils/auth/validators";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    const requiredError = validateRequired(email);
    if (requiredError) {
        errors.email = requiredError;
    } else {
        const emailError = validateEmailFormat(email);
        if (emailError) {
        errors.email = emailError;
        }
    }

    if (Object.keys(errors).length > 0) {
        setErrors(errors);
        return;
    }

    // kasnije login()
    };

  return (
    <div className="w-full max-w-md">

      {/* CARD */}
      <div className="bg-brand-surface border border-brand-border rounded-2xl shadow-premium p-8 space-y-6">

        {/* Title */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold">
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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() =>
                setErrors((prev) => ({ ...prev, email: "" }))
            }
            className={`
                w-full
                border
                rounded-lg
                px-4
                py-2
                focus:outline-none
                focus:ring-1
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
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              border
              border-brand-border
              rounded-lg
              px-4
              py-2
              focus:outline-none
              focus:ring-1
              focus:ring-brand-accent
            "
          />
         

          {/* BUTTON */}
          <button
            type="submit"
            className="
              w-full
              py-3
              rounded-lg
              font-medium
              text-white
              bg-brand-primary
              hover:bg-brand-primary-dark
              transition
            "
          >
            Sign in
          </button>

        </form>

      </div>

    </div>
  );
}