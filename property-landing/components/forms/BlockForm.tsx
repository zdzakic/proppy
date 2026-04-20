"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import FormError from "@/components/ui/FormError";

type CompanyOption = {
  id: number;
  name: string;
};

export type BlockFormValues = {
  name: string;
  companyId: number | null;
};

type BlockFormProps = {
  /** Pre-fills the form for edit mode. When absent the form starts empty (add mode). */
  defaultValues?: { name?: string };
  /**
   * When length === 1: company is auto-selected and the select is hidden.
   * When length > 1: select is shown and required.
   * When absent/empty: no company select rendered (edit mode).
   */
  companyOptions?: CompanyOption[];
  onSubmit: (values: BlockFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
  /** Defaults to "Save". Pass "Save Changes" for edit modals. */
  submitLabel?: string;
  onCancel: () => void;
};

/**
 * UI-only form for creating or editing a block.
 * Shared by AddBlockModal (add mode) and EditBlockModal (edit mode).
 * No API calls — calls onSubmit with typed values.
 */
export default function BlockForm({
  defaultValues,
  companyOptions = [],
  onSubmit,
  isSubmitting,
  error,
  submitLabel = "Save",
  onCancel,
}: BlockFormProps) {
  const autoCompanyId = companyOptions.length === 1 ? companyOptions[0].id : null;

  const [name, setName] = useState(defaultValues?.name ?? "");
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(autoCompanyId);

  const showCompanySelect = companyOptions.length > 1;
  const isSubmitDisabled =
    !name.trim() || isSubmitting || (showCompanySelect && !selectedCompanyId);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) return;
    onSubmit({ name: name.trim(), companyId: selectedCompanyId });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="block-name-input" className="text-sm text-dashboard-muted">
          Block Name
        </label>
        <input
          id="block-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Block name"
          className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
        />
      </div>

      {showCompanySelect ? (
        <div className="space-y-1">
          <label htmlFor="block-company-select" className="text-sm text-dashboard-muted">
            Company
          </label>
          <select
            id="block-company-select"
            value={selectedCompanyId ?? ""}
            onChange={(e) => {
              const raw = e.target.value;
              setSelectedCompanyId(raw ? Number(raw) : null);
            }}
            className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
          >
            <option value="">Select company</option>
            {companyOptions.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

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
