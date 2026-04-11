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

import DashboardMenuItem from "@/components/dashboard/layout/DashboardMenuItem";
import { getDashboardSidebarItems } from "@/config/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SideBar() {
  const { user } = useAuth();
  const sidebarItems = getDashboardSidebarItems(user?.roles);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-dashboard-border bg-dashboard-surface md:flex">
      {/* 
        Gornji brand / logo dio sidebara.
        Za sada je tekstualni placeholder.
      */}
      <div className="mt-4 flex h-16 items-center justify-center px-6 text-2xl font-semibold text-dashboard-text">
        Rookerys
      </div>

      {/* 
        Glavna navigacija.
        Linkovi su trenutno statični da prvo stabilizujemo layout UI.
      */}
      <nav className="flex-1 space-y-2 p-4 mt-8">
        {sidebarItems.map((item) => (
          <DashboardMenuItem
            key={item.label}
            href={item.href}
            icon={item.icon}
            label={item.label}
            variant="sidebar"
          />
        ))}
      </nav>
    </aside>
  );
}