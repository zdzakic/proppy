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
  import ProtectedRoute from "@/components/ui/auth/ProtectedRoute";
  import { useState } from "react";

  export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
      <ProtectedRoute>
          <ThemeProvider>
          <div className="flex min-h-screen bg-dashboard-bg text-dashboard-text">

              {/* Sidebar */}
                <SideBar
                  open={mobileSidebarOpen}
                  onClose={() => setMobileSidebarOpen(false)}
                />

              {/* Main wrapper */}
                <div className="flex flex-1 flex-col md:ml-64">

                <Header onMenuClick={() => setMobileSidebarOpen((prev) => !prev)} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6">
                  <div className="mx-auto w-full ">
                  {children}
                  </div>
              </main>

              </div>

          </div>
          </ThemeProvider>
      </ProtectedRoute>
    );
  }