"use client";
/**
 * Reusable Spinner component
 *
 * Šta radi:
 * - prikazuje loading spinner
 * - podržava više veličina (sm, md, lg)
 * - koristi postojeće light/dark Tailwind boje
 *
 * Zašto ovako:
 * - zadržavamo postojeći color sistem (radi već)
 * - dodajemo samo size + override (className)
 * - KISS i reusable kroz cijelu app
 */

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

export default function Spinner({
  size = "md",
  className = "",
}: SpinnerProps) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-10 w-10 border-2",
  };

  return (
    <div
      className={`
        animate-spin rounded-full
        border-gray-300 border-t-black
        dark:border-gray-700 dark:border-t-white
        ${sizes[size]}
        ${className}
      `}
    />
  );
}
