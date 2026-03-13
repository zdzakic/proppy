"use client";

/**
 * Path: components/theme/ThemeToggle.tsx
 *
 * Theme toggle button za dashboard header.
 *
 * Šta radi:
 * - prikazuje trenutno dostupnu akciju (switch theme)
 * - poziva toggleTheme iz ThemeProvider-a
 *
 * Zašto ovako:
 * - toggle logika ne treba biti u Header komponenti
 * - dugme ostaje malo, fokusirano i reusable
 *
 * Šta rješava:
 * - odvaja UI kontrolu od theme state logike
 */

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="
        inline-flex items-center gap-2
        rounded-lg border border-dashboard-border
        bg-dashboard-surface px-3 py-2
        text-sm font-medium
        hover:opacity-90
        transition
      "
      aria-label="Toggle dashboard theme"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-4 w-4" />
          Dark
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          Light
        </>
      )}
    </button>
  );
}