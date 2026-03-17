/**
 * Reusable Button component
 *
 * Šta radi:
 * - renderuje standardizovano dugme kroz aplikaciju
 * - podržava loading state (spinner desno od teksta)
 *
 * Zašto ovako:
 * - uklanja duplikaciju (login, register, forms…)
 * - osigurava konzistentan UI i UX
 * - koristi postojeće brand tokene (light/dark već riješeno globalno)
 */

"use client";

import Spinner from "@/components/ui/Spinner";

type ButtonProps = {
  children: React.ReactNode;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  type = "button",
  loading = false,
  disabled = false,
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`
        w-full
        py-3
        rounded-lg
        font-medium
        text-white
        bg-brand-primary
        hover:bg-brand-primary-dark
        transition-colors duration-200
        flex items-center justify-center gap-2
        cursor-pointer

        ${className}
      `}
    >
      {/* TEXT */}
      <span className="min-w-[90px] text-center">
         {loading ? " Signing in..." : children}
      </span>

      {/* SPINNER */}
      {loading && (
        <Spinner
          size="sm"
          className="inline-block border-white border-t-transparent"
        />
      )}
    </button>
  );
}