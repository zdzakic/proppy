"use client";

/**
SideBar

Dashboard navigacija.

Dizajn:
- tamniji navy
- vertikalni menu
- mobile collapse kasnije
*/

export default function SideBar() {
  return (
    <aside className="w-64 bg-brand-primary-dark border-r border-brand-border hidden md:block">

      <nav className="p-6 space-y-3">

        <a
          href="/dashboard"
          className="block text-white/80 hover:text-white transition"
        >
          Dashboard
        </a>

        <a
          href="/properties"
          className="block text-white/80 hover:text-white transition"
        >
          Properties
        </a>

        <a
          href="/tenants"
          className="block text-white/80 hover:text-white transition"
        >
          Tenants
        </a>

      </nav>

    </aside>
  );
}