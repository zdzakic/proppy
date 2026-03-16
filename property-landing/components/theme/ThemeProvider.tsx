"use client";

/**
 * Path: components/theme/ThemeProvider.tsx
 *
 * Dashboard theme provider.
 *
 * Šta radi:
 * - čuva trenutni theme state ("light" | "dark")
 * - omogućava toggle između light i dark moda
 * - čuva odabranu temu u localStorage
 * - postavlja / uklanja "dark" klasu na html element
 *
 * Zašto ovako:
 * - dashboard koristi CSS tokene definisane u globals.css
 * - .dark klasa aktivira dark dashboard tokene
 * - provider je ograničen samo na dashboard layout, ne i na landing page
 *
 * Šta rješava:
 * - centralizuje theme logiku
 * - omogućava da ThemeToggle i druge dashboard komponente koriste isti state
 */

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    //   const [theme, setTheme] = useState<Theme>("light");
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window === "undefined") return "light";

        const stored = localStorage.getItem("theme");

        return stored === "dark" ? "dark" : "light";
    });

  /**
   * Sinhronizacija:
   * - upis teme u localStorage
   * - postavljanje .dark klase na <html>
   *
   * Zašto:
   * - globals.css koristi .dark selector za dashboard dark tokene
   */
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  /**
   * Jednostavan toggle light <-> dark.
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Custom hook za čitanje theme contexta.
 *
 * Zašto:
 * - skriva direktan rad sa useContext
 * - daje čišći API u komponentama poput ThemeToggle
 */
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}