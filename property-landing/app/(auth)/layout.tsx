/**
 * AuthLayout
 *
 * ZAŠTO:
 * Auth layout definiše dvokolonski raspored
 * za sve authentication stranice.
 *
 * LEFT  → forma
 * RIGHT → promo sadržaj
 *
 * Toaster mora biti van grid-a kako ne bi
 * postao grid item.
 */

import { Toaster } from "sonner";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="absolute inset-0">

      {/* GRID LAYOUT */}
      <div className="grid h-full w-full grid-cols-1 lg:grid-cols-2">
        {children}
      </div>

      {/* GLOBAL TOASTER */}
      <Toaster position="top-right" richColors />

    </div>
  );
}