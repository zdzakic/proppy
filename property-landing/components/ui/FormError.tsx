"use client";

/**
 * FormError
 *
 * ZAŠTO:
 * - prikazuje globalnu grešku forme (API, login fail itd.)
 * - centralizuje UI za sve form error-e
 *
 * ŠTA RADI:
 * - ako nema message → ne renderuje ništa
 * - ako ima → prikazuje stilizovanu grešku
 */

type FormErrorProps = {
  message?: string;
};

export default function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <p className="text-sm text-error text-center">
      {message}
    </p>
  );
}