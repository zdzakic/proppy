"use client";

import Header from "@/components/dashboard/layout/Header";
import SideBar from "@/components/dashboard/layout/SideBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-brand-background text-white">

      {/* TOP HEADER */}
      <Header />

      {/* BODY */}
      <div className="flex flex-1">

        {/* SIDEBAR */}
        <SideBar />

        {/* MAIN */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}