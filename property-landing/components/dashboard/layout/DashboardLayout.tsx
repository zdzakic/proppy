"use client";

/**
DashboardLayout

Centralni layout za sve dashboard stranice.

Rješava:
- Header
- Sidebar
- Content area
- max width container
- koristi brand tokene iz globals.css
*/

import Header from "./Header";
import SideBar from "./SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">

      <Header />

      <div className="flex flex-1">

        <SideBar />

        <main className="flex-1 flex justify-center">
          <div className="w-full max-w-7xl px-6 py-8">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}