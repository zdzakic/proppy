"use client";

/**
 * Path: app/dashboard/layout.tsx
 *
 * Dashboard layout route wrapper.
 *
 * Šta radi:
 * - obavija sve dashboard stranice zajedničkim layoutom
 * - uključuje ThemeProvider samo za dashboard dio aplikacije
 * - renderuje sidebar, header i main content zonu
 *
 * Zašto ovako:
 * - landing page ne treba theme switching
 * - dashboard je aplikativni dio sistema i ima svoj UI shell
 * - App Router layout je pravo mjesto za shared dashboard strukturu
 *
 * Šta rješava:
 * - izbjegava ponavljanje sidebar/header koda po svakoj dashboard stranici
 * - centralizuje dashboard UI skeleton
 */

import ThemeProvider from "@/components/theme/ThemeProvider";
import SideBar from "@/components/dashboard/layout/SideBar";
import Header from "@/components/dashboard/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="flex min-h-screen bg-dashboard-bg text-dashboard-text">

        {/* Sidebar */}
        <SideBar />

        {/* Main wrapper */}
        <div className="ml-64 flex flex-1 flex-col">

          <Header />

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="mx-auto w-full ">
              {children}
            </div>
          </main>

        </div>

      </div>
    </ThemeProvider>
  );
}