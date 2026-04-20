"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import FormError from "@/components/ui/FormError";

export type PropertyFormValues = {
  name: string;
  comment: string;
};

type PropertyFormProps = {
  /** Pre-fills the form for edit mode. When absent the form starts empty (add mode). */
  defaultValues?: { name?: string; comment?: string };
  onSubmit: (values: PropertyFormValues) => void;
  isSubmitting: boolean;
  error?: string | null;
  /** Defaults to "Save Property". */
  submitLabel?: string;
  onCancel: () => void;
};

/**
 * UI-only form for creating or editing a property.
 * Shared by AddPropertyModal (add mode) and EditPropertyModal (edit mode).
 * No API calls — calls onSubmit with typed values.
 */
export default function PropertyForm({
  defaultValues,
  onSubmit,
  isSubmitting,
  error,
  submitLabel = "Save Property",
  onCancel,
}: PropertyFormProps) {
  const [name, setName] = useState(defaultValues?.name ?? "");
  const [comment, setComment] = useState(defaultValues?.comment ?? "");

  const isSubmitDisabled = !name.trim() || isSubmitting;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) return;
    onSubmit({ name: name.trim(), comment: comment.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-1">
        <label htmlFor="property-name" className="text-sm text-dashboard-muted">
          Property Name
        </label>
        <input
          id="property-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sunset Residency"
          className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="property-comment" className="text-sm text-dashboard-muted">
          Comment (Optional)
        </label>
        <textarea
          id="property-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Optional note about this property"
          rows={4}
          className="w-full resize-y rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
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
          className="sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitDisabled}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </ActionButton>
      </div>
    </form>
  );
}
