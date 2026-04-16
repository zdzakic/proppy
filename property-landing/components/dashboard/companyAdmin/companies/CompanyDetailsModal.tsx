"use client";

import { X } from "lucide-react";

import ActionButton from "@/components/ui/ActionButton";
import type { Company } from "@/types/company";

type CompanyDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
};

export default function CompanyDetailsModal({
  isOpen,
  onClose,
  company,
}: CompanyDetailsModalProps) {
  if (!isOpen) return null;

  const titleId = "company-details-title";

  const companyName = company?.name ?? "Company details";
  const addressText = company?.address?.trim()
    ? company.address
    : "No address provided";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-dashboard-sidebar/40 p-3 sm:items-center sm:p-4">
      <div
        className="w-full max-w-3xl overflow-hidden rounded-xl border border-dashboard-border bg-dashboard-surface shadow-premium"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="flex items-start justify-between gap-3 border-b border-dashboard-border p-4 sm:p-6">
          <div className="min-w-0">
            <h2
              id={titleId}
              className="truncate text-lg font-semibold text-dashboard-text"
            >
              {companyName}
            </h2>
            <p className="text-xs text-dashboard-muted">Company information</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-md border border-dashboard-border bg-dashboard-surface p-2 text-dashboard-text transition-colors hover:bg-dashboard-hover"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="max-h-[80vh] overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            {company ? (
              <dl className="grid gap-4 sm:grid-cols-2">
                {[
                  { label: "Name", value: company.name },
                  { label: "Address", value: addressText },
                  { label: "Blocks", value: company.block_count ?? 0 },
                  { label: "Properties", value: company.property_count ?? 0 },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-dashboard-border bg-dashboard-hover/50 p-3">
                    <dt className="text-[11px] uppercase tracking-wide text-dashboard-muted">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-dashboard-text">{item.value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-xs text-dashboard-muted">Loading company details...</p>
            )}

            <div className="flex justify-end">
              <ActionButton
                onClick={onClose}
                variant="neutral"
                className="border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover"
              >
                Close
              </ActionButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
