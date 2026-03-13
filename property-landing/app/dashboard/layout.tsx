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
        {/* 
          Sidebar je stalna navigacija dashboarda.
          Ostaje odvojena od content dijela.
        */}
        <SideBar />

        {/* 
          Desna strana layouta:
          - header gore
          - page content ispod
        */}
        <div className="flex flex-1 flex-col">
          <Header />

          {/* 
            Main content area.
            max-w-7xl drži sadržaj urednim i preglednim na velikim ekranima.
          */}
          <main className="flex-1 p-6">
            <div className="mx-auto w-full max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

// "use client";

// import Header from "@/components/dashboard/layout/Header";
// import SideBar from "@/components/dashboard/layout/SideBar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <div className="flex flex-col min-h-screen bg-brand-background text-white">

//       {/* TOP HEADER */}
//       <Header />

//       {/* BODY */}
//       <div className="flex flex-1">

//         {/* SIDEBAR */}
//         <SideBar />

//         {/* MAIN */}
//         <main className="flex-1 p-6 overflow-y-auto">
//           {children}
//         </main>

//       </div>

//     </div>
//   );
// }