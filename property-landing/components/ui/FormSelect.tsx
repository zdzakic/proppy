"use client";

/**
 * FormSelect
 * What: Generic controlled <select> styled to match dashboard form inputs.
 * Why: Avoids repeating the same input class string across every select in the app.
 * Break: Selects lose consistent styling and must be styled individually.
 */

export type SelectOption = { value: string; label: string };

type FormSelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
};

const BASE_CLASS =
  "rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-ring";

export default function FormSelect({ id, value, onChange, options, className = "" }: FormSelectProps) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`${BASE_CLASS} ${className}`.trim()}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
