"use client";


import { useContext } from "react";
import { useAuth } from "@/context/AuthContext";

/**
 * Path: components/dashboard/layout/Header.tsx
 *
 * DASHBOARD HEADER (TOP BAR)
 *
 * Šta radi:
 * - Prikazuje globalnu kontrolnu traku dashboard aplikacije
 *
 * Sadrži:
 * - logo aplikacije
 * - theme switch (placeholder)
 * - logout dugme
 *
 * Zašto postoji:
 * - Omogućava pristup globalnim akcijama iz bilo koje dashboard stranice
 *
 * Koji problem rješava:
 * - Centralizuje logout i user kontrole
 * - Osigurava konzistentan UI kroz cijeli dashboard
 *
 * Napomena:
 * - Header je uvijek vidljiv jer je dio dashboard layouta
 * - Kasnije se ovdje može dodati:
 *   - user avatar
 *   - notifications
 *   - search
 */

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-brand-surface border-b border-brand-border flex items-center justify-between px-6">

      {/* LEFT – APP LOGO */}
      <div className="text-xl font-bold text-brand-accent">
        Rookerys
      </div>

      {/* RIGHT – USER CONTROLS */}
      <div className="flex items-center gap-4">

        {/* Theme switch placeholder */}
        <button className="text-white/70 hover:text-white transition">
          Theme
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="text-red-400 hover:text-red-300 transition"
        >
          Logout
        </button>

      </div>

    </header>
  );
}