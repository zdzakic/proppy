"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import FormError from "@/components/ui/FormError";

export type CompanyFormValues = {
  name: string;
  address: string;
};

type CompanyFormProps = {
  /** Pre-fills the form for edit mode. When absent the form starts empty (add mode). */
  defaultValues?: { name?: string; address?: string };
  onSubmit: (values: CompanyFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
  /** Defaults to "Save". Pass "Save Changes" for edit modals. */
  submitLabel?: string;
  onCancel: () => void;
};

/**
 * UI-only form for creating or editing a company.
 * Shared by AddCompanyModal (add mode) and EditCompanyModal (edit mode).
 * No API calls — calls onSubmit with typed values.
 */
export default function CompanyForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  error,
  submitLabel = "Save",
  onCancel,
}: CompanyFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [address, setAddress] = useState(defaultValues?.address ?? "");

  const isSubmitDisabled = !name.trim() || isSubmitting;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) return;
    onSubmit({ name: name.trim(), address: address.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="company-name-input" className="text-sm text-dashboard-muted">
          Company Name
        </label>
        <input
          id="company-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Company name"
          className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="company-address-input" className="text-sm text-dashboard-muted">
          Address
        </label>
        <input
          id="company-address-input"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Optional"
          className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
        />
      </div>

      <FormError message={error ?? undefined} />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <ActionButton
          type="button"
          onClick={onCancel}
          variant="neutral"
          fullWidth
          className="sm:w-auto"
          disabled={isSubmitting}
        >
          Cancel
        </ActionButton>

        <ActionButton
          type="submit"
          variant="primary"
          fullWidth
          className="sm:w-auto disabled:cursor-not-allowed disabled:opacity-60 dark:border-brand-accent dark:bg-brand-accent dark:text-dashboard-sidebar dark:hover:opacity-95"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </ActionButton>
      </div>
    </form>
  );
}
