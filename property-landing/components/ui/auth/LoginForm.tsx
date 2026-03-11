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

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <form className="space-y-4">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              border
              border-brand-border
              rounded-lg
              px-4
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-brand-accent
            "
          />

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
              focus:ring-2
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