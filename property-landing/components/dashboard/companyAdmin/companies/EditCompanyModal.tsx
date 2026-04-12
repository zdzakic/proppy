"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import FormError from "@/components/ui/FormError";
import ActionButton from "@/components/ui/ActionButton";
import type { Company } from "@/types/company";

type EditCompanyModalProps = {
  isOpen: boolean;
  company: Company | null;
  isSaving: boolean;
  error: string | null;
  onSave: (payload: { name: string }) => Promise<void>;
  onClose: () => void;
};

export default function EditCompanyModal({
  isOpen,
  company,
  isSaving,
  error,
  onSave,
  onClose,
}: EditCompanyModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (!company) return;
    setName(company.name);
  }, [company]);

  if (!isOpen || !company) return null;

  const isSubmitDisabled = !name.trim() || isSaving;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    await onSave({
      name: name.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-dashboard-sidebar/40 p-3 sm:items-center sm:p-4">
      <div className="w-full max-w-xl rounded-xl border border-dashboard-border bg-dashboard-surface p-4 shadow-premium sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-dashboard-text">Update Company</h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md border border-dashboard-border bg-dashboard-surface p-2 text-dashboard-text transition-colors hover:bg-dashboard-hover"
            aria-label="Close"
            disabled={isSaving}
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="space-y-1">
            <label htmlFor="edit-company-name" className="text-sm text-dashboard-muted">
              Company Name
            </label>
            <input
              id="edit-company-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
            />
          </div>

          <FormError message={error ?? undefined} />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <ActionButton
              type="button"
              onClick={onClose}
              variant="neutral"
              fullWidth
              className="sm:w-auto"
              disabled={isSaving}
            >
              Cancel
            </ActionButton>

            <ActionButton
              type="submit"
              variant="primary"
              fullWidth
              className="sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSubmitDisabled}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </ActionButton>
          </div>
        </form>
      </div>
    </div>
  );
}
