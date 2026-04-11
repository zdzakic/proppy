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

type SideBarProps = {
  open?: boolean;
  onClose?: () => void;
};

export default function SideBar({ open = false, onClose }: SideBarProps) {
  const { user } = useAuth();
  const sidebarItems = getDashboardSidebarItems(user?.roles);

  return (
    <>
      {/* Desktop sidebar */}
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
        <nav className="mt-8 flex-1 space-y-2 p-4">
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

      {/* Mobile backdrop */}
      {open ? (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      ) : null}

      {/* Mobile drawer */}
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-64 border-r border-dashboard-border bg-dashboard-surface transition-transform duration-200 md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="mt-4 flex h-16 items-center justify-center px-6 text-2xl font-semibold text-dashboard-text">
          Rookerys
        </div>

        <nav className="mt-8 flex-1 space-y-2 p-4">
          {sidebarItems.map((item) => (
            <DashboardMenuItem
              key={item.label}
              href={item.href}
              icon={item.icon}
              label={item.label}
              onClick={onClose}
              variant="sidebar"
            />
          ))}
        </nav>
      </aside>
    </>
  );
}