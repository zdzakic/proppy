"use client";

/**
 * Path: components/dashboard/Header.tsx
 *
 * Dashboard header.
 *
 * Šta radi:
 * - sticky top navigation
 * - prikazuje naslov sekcije
 * - sadrži theme toggle
 * - sadrži user dropdown meni
 *
 * Zašto ovako:
 * - header mora ostati lagan
 * - user akcije su uvijek u gornjem desnom uglu
 *
 * Šta rješava:
 * - centralno mjesto za dashboard actions
 */

import { User, Settings, LogOut } from "lucide-react";
import { useState, useRef } from "react";
import {useAuth} from "@/context/AuthContext";
import ThemeToggle from "@/components/theme/ThemeToggle";


export default function Header() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const { logout } = useAuth();

  const handleEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleLeave = () => {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, 150); // mali delay
  };

  return (
    <header
      className="
        sticky
        top-0
        z-30
        flex
        h-24
        items-center
        justify-between
        border-b
        border-dashboard-border
        bg-dashboard-surface
        px-6
      "
    >
      <div className="text-3xl font-semibold text-dashboard-text">
        Dashboard
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {/* USER MENU */}
        <div
          className="relative"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <button
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
          >
            <User className="h-5 w-5" />
          </button>

          {open && (
            <div
                className="
                absolute
                right-0
                mt-2
                w-48
                p-1
                rounded-xl
                border
                border-dashboard-border
                bg-dashboard-surface
                shadow-lg
                "
            >
                <button
                className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-md
                    px-3
                    py-2
                    text-left
                    text-sm
                    text-dashboard-text
                    transition-colors
                    hover:bg-dashboard-hover
                    cursor-pointer
                "
                >
                <User className="h-4 w-4 opacity-70" />
                Profile
                </button>

                <button
                className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-md
                    px-3
                    py-2
                    text-left
                    text-sm
                    text-dashboard-text
                    transition-colors
                    hover:bg-dashboard-hover
                    cursor-pointer
                "
                >
                <Settings className="h-4 w-4 opacity-70" />
                Settings
                </button>

                <div className="my-1 border-t border-dashboard-border"></div>

                <button
                onClick={logout}
                className="
                    flex
                    w-full
                    items-center
                    gap-2
                    rounded-md
                    px-3
                    py-2
                    text-left
                    text-sm
                    text-dashboard-text
                    transition-colors
                    hover:bg-dashboard-hover
                    cursor-pointer
                "
                >
                <LogOut className="h-4 w-4 opacity-70" />
                Logout
                </button>
            </div>
            )}
        </div>
      </div>
    </header>
  );
}