"use client";

import Link from "next/link";

/**
 * Path: components/dashboard/layout/SideBar.tsx
 *
 * DASHBOARD SIDEBAR
 *
 * Šta radi:
 * - Prikazuje glavnu navigaciju dashboard aplikacije
 *
 * Sadrži:
 * - linkove prema dashboard sekcijama
 *
 * Zašto postoji:
 * - Sidebar je primarna navigacija u dashboard aplikaciji
 *
 * Koji problem rješava:
 * - Centralizuje navigaciju
 * - Omogućava brzo kretanje između sekcija
 *
 * Napomena:
 * - Za sada je statičan
 * - Kasnije će koristiti:
 *   - role based navigation (owner / tenant / admin)
 *   - centralni config iz lib/links.ts
 */

export default function SideBar() {
  return (
    <aside className="w-64 bg-brand-surface border-r border-brand-border p-4">

      <nav className="flex flex-col gap-2">

        <Link
          href="/dashboard"
          className="px-3 py-2 rounded-md hover:bg-brand-primary/20 transition"
        >
          Dashboard
        </Link>

        <Link
          href="/dashboard/properties"
          className="px-3 py-2 rounded-md hover:bg-brand-primary/20 transition"
        >
          Properties
        </Link>

        <Link
          href="/dashboard/works"
          className="px-3 py-2 rounded-md hover:bg-brand-primary/20 transition"
        >
          Works
        </Link>

      </nav>

    </aside>
  );
}