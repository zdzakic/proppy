"use client";

import { useState } from "react";
import ActionButton from "@/components/ui/ActionButton";
import FormError from "@/components/ui/FormError";
import { useCreateProperty } from "@/hooks/useCreateProperty";
import type { CreatePropertyResponse } from "@/types/property";

export type AddPropertyFormValues = {
  name: string;
  comment: string;
};

type AddPropertyFormProps = {
  blockId: number;
  onSubmit?: (values: AddPropertyFormValues) => void;
  onCreated?: (property: CreatePropertyResponse) => void;
  onCancel?: () => void;
  submitLabel?: string;
};

/**
 * UI-only form for creating a property.
 *
 * Why:
 * - gives a reusable, typed form shell before API wiring
 * - keeps input UX consistent with dashboard design tokens
 */
export default function AddPropertyForm({
  blockId,
  onSubmit,
  onCreated,
  onCancel,
  submitLabel = "Save Property",
}: AddPropertyFormProps) {
  const { createProperty, isLoading, error, clearError } = useCreateProperty();

  const [values, setValues] = useState<AddPropertyFormValues>({
    name: "",
    comment: "",
  });

  const isSubmitDisabled = !values.name.trim();

  const handleChange = <K extends keyof AddPropertyFormValues>(
    key: K,
    value: AddPropertyFormValues[K]
  ) => {
    clearError();
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitDisabled) return;

    const createdProperty = await createProperty(blockId, values);

    if (!createdProperty) {
      return;
    }

    setValues({ name: "", comment: "" });
    onSubmit?.(values);
    onCreated?.(createdProperty);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6"
      noValidate
    >
      <div>
        <h2 className="text-lg font-semibold text-dashboard-text">Add Property</h2>
        <p className="text-sm text-dashboard-muted">
          Fill in the fields supported by the current backend contract.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="property-name" className="text-sm text-dashboard-muted">
            Property Name
          </label>
          <input
            id="property-name"
            type="text"
            value={values.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Sunset Residency"
            className="w-full rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
          />
        </div>

        <div className="space-y-1 sm:col-span-2">
          <label htmlFor="property-comment" className="text-sm text-dashboard-muted">
            Comment (Optional)
          </label>
          <textarea
            id="property-comment"
            value={values.comment}
            onChange={(e) => handleChange("comment", e.target.value)}
            placeholder="Optional note about this property"
            rows={4}
            className="w-full resize-y rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
          />
        </div>
      </div>

      <FormError message={error ?? undefined} />

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <ActionButton
          type="button"
          onClick={onCancel}
          variant="neutral"
          fullWidth
          className="sm:w-auto"
          disabled={isLoading}
        >
          Cancel
        </ActionButton>

        <ActionButton
          type="submit"
          variant="primary"
          fullWidth
          className="sm:w-auto disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isSubmitDisabled || isLoading}
        >
          {isLoading ? "Saving..." : submitLabel}
        </ActionButton>
      </div>
    </form>
  );
}
