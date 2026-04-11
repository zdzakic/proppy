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

import { Menu, User } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/theme/ThemeToggle";
import DashboardMenuItem from "@/components/dashboard/layout/DashboardMenuItem";
import { getDashboardUserMenuItems } from "@/config/navigation";

type HeaderProps = {
  onMenuClick?: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { logout, user } = useAuth();
  const userMenuItems = getDashboardUserMenuItems(user?.roles);

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
        h-20
        items-center
        justify-between
        border-b
        border-dashboard-border
        bg-dashboard-surface
        px-4
        sm:px-6
        md:h-24
      "
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-dashboard-text hover:bg-dashboard-hover md:hidden"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="text-xl font-semibold text-dashboard-text sm:text-2xl md:text-3xl">
          Dashboard
        </div>
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
            type="button"
            onClick={() => setOpen((prev) => !prev)}
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
                {userMenuItems.map((item) => (
                  <div key={item.label}>
                    {item.separatorBefore ? (
                      <div className="my-1 border-t border-dashboard-border"></div>
                    ) : null}
                    <DashboardMenuItem
                      href={item.href}
                      icon={item.icon}
                      label={item.label}
                      onClick={() => {
                        if (item.action === "logout") {
                          logout();
                        }
                        setOpen(false);
                      }}
                      variant="dropdown"
                    />
                  </div>
                ))}
            </div>
            )}
        </div>
      </div>
    </header>
  );
}