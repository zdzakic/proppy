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
import { validateLoginForm, type ValidationErrors } from "@/utils/auth/validators";
import apiPublic from "@/utils/api/apiPublic";
import apiClient from "@/utils/api/apiClient";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

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
    const response = await apiPublic.post("token/", {
      email,
      password,
    });

    const { access, refresh } = response.data;

    console.log("LOGIN SUCCESS");
    console.log(response.data);

    // spremi token i user 
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem("user", JSON.stringify(response.data.user));

  } catch (error: any) {

    console.error("LOGIN ERROR");

    if (error.response?.data) {
      console.log(error.response.data);
    }
  }

  // test user/me
    //   const testAuth = async () => {
    //     const response = await apiClient.get("users/me/");
    //     console.log("AUTH ME TEST", response.data);
    //   };
    
    //   testAuth();
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
            autoComplete="email"
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
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={() =>
                setErrors((prev) => ({ ...prev, password: "" }))
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