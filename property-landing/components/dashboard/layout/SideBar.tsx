"use client";

/**
 * Path: components/dashboard/Sidebar.tsx
 *
 * Dashboard sidebar navigacija.
 *
 * Šta radi:
 * - prikazuje osnovne dashboard linkove
 * - vizuelno odvaja navigaciju od glavnog sadržaja
 *
 * Zašto ovako:
 * - sidebar je ključni navigacioni element u SaaS dashboardu
 * - za sada držimo linkove statičnim zbog KISS pristupa
 * - kasnije se lako može prebaciti na data-driven config
 *
 * Šta rješava:
 * - uspostavlja stalnu i jasnu dashboard navigaciju
 * - daje dashboardu strukturu sličnu NextAdmin stilu
 */

import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
} from "lucide-react";

export default function SideBar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-dashboard-sidebar text-white md:flex">
      {/* 
        Gornji brand / logo dio sidebara.
        Za sada je tekstualni placeholder.
      */}
      <div className="flex h-16 items-center border-b border-white/10 px-6 text-lg font-semibold">
        Rookerys
      </div>

      {/* 
        Glavna navigacija.
        Linkovi su trenutno statični da prvo stabilizujemo layout UI.
      */}
      <nav className="flex-1 space-y-2 p-4">
        <a
          href="/dashboard"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white/90 hover:bg-white/10"
        >
          <LayoutDashboard className="h-5 w-5" />
          <span>Dashboard</span>
        </a>

        <a
          href="/dashboard/properties"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white/90 hover:bg-white/10"
        >
          <Building2 className="h-5 w-5" />
          <span>Properties</span>
        </a>

        <a
          href="/dashboard/tenants"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white/90 hover:bg-white/10"
        >
          <Users className="h-5 w-5" />
          <span>Tenants</span>
        </a>

        <a
          href="/dashboard/settings"
          className="flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-white/90 hover:bg-white/10"
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </a>
      </nav>
    </aside>
  );
}