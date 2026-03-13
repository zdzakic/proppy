"use client";

/**
 * Path: components/dashboard/Header.tsx
 *
 * Dashboard top header.
 *
 * Šta radi:
 * - prikazuje naslov sekcije
 * - sadrži dashboard actions zonu
 * - trenutno uključuje ThemeToggle
 *
 * Zašto ovako:
 * - header treba ostati lagan i fokusiran
 * - dodatne akcije (notifications, user menu, search) mogu se lako dodati kasnije
 *
 * Šta rješava:
 * - uspostavlja gornju navigacionu zonu dashboarda
 * - drži theme switch na očekivanom mjestu
 */

import ThemeToggle from "@/components/theme/ThemeToggle";

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-dashboard-border bg-dashboard-header px-6">
      {/* 
        Lijeva strana headera.
        Za sada samo title trenutne dashboard zone.
      */}
      <div className="text-sm font-semibold text-white">
        Dashboard
      </div>

      {/* 
        Desna strana headera.
        Ovdje će kasnije ići user menu, notifications, search itd.
      */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
}