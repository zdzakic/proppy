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
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        text-dashboard-text 
        hover:bg-dashboard-hover
        transition
        cursor-pointer
      "
      aria-label="Toggle dashboard theme"
    >
      {theme === "light" ? (
        <>
          <Moon className="h-5 w-5" />
        </>
      ) : (
        <>
          <Sun className="h-5 w-5" />
        </>
      )}
    </button>
  );
}