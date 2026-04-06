"use client";

/**
 * FormInput
 *
 * ZAŠTO:
 * - uklanja dupliciran kod iz formi (login, register, itd.)
 *
 * ŠTA RJEŠAVA:
 * - konzistentan izgled inputa
 * - centralizovan error prikaz
 *
 * KAKO:
 * - prima value, onChange i error
 * - sam odlučuje styling (error vs normal)
 */

import FieldError from "./FieldError";

type FormInputProps = {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: () => void;
  error?: string;
  autoComplete?: string;
};

export default function FormInput({
  type = "text",
  placeholder,
  value,
  onChange,
  onFocus,
  error,
  autoComplete,
}: FormInputProps) {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        autoComplete={autoComplete}
        className={`
          w-full
          border
          rounded-lg
          px-4
          py-2
          focus:outline-none
          focus:ring-1
          bg-transparent
          text-brand-text
          placeholder:text-brand-muted
          transition
          ${
            error
              ? "border-error focus:ring-error/30"
              : "border-brand-border focus:ring-brand-accent"
          }
        `}
      />

      <FieldError message={error} />

    </div>
  );
}