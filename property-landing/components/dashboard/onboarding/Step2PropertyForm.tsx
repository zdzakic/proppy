"use client";

import ActionButton from "@/components/ui/ActionButton";
import FormInput from "@/components/ui/FormInput";
import FormError from "@/components/ui/FormError";

export type Step2PropertyFormProps = {
  blockName: string | null;
  propertyName: string;
  onPropertyNameChange: (value: string) => void;
  propertyComment: string;
  onPropertyCommentChange: (value: string) => void;
  propertyNameError: string | null;
  propApiError: string | null;
  propLoading: boolean;
  onBack: () => void;
  onSave: () => void;
  btnClass: string;
};

export default function Step2PropertyForm({
  blockName,
  propertyName,
  onPropertyNameChange,
  propertyComment,
  onPropertyCommentChange,
  propertyNameError,
  propApiError,
  propLoading,
  onBack,
  onSave,
  btnClass,
}: Step2PropertyFormProps) {
  return (
    <>
      <div className="flex flex-col gap-4 border-b border-dashboard-border px-6 py-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6 md:px-8 md:py-6">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium text-dashboard-muted">
            Step 2 of 2
          </p>
          <h3 className="text-lg font-semibold text-dashboard-text">
            Add your property to the block
          </h3>
          {blockName ? (
            <p className="text-sm text-dashboard-muted">
              Block:{" "}
              <span className="font-medium text-dashboard-text">
                {blockName}
              </span>
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 py-5 md:px-8 md:py-6">
        <p className="text-xs text-dashboard-muted">
          Add your first property to the block. You can add more later.
        </p>
        <fieldset
          disabled={propLoading}
          className="m-0 w-full border-0 p-0 disabled:pointer-events-none disabled:opacity-60 md:max-w-[420px]"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="property-name"
                className="text-xs text-dashboard-muted"
              >
                Property Name
              </label>
              <div className="[&_input]:rounded-md [&_input]:border-dashboard-border [&_input]:bg-dashboard-surface [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm [&_input]:text-dashboard-text [&_input]:placeholder:text-dashboard-muted [&_input]:focus:ring-2 [&_input]:focus:ring-dashboard-ring">
                <FormInput
                  placeholder="Sunset Residency"
                  value={propertyName}
                  onChange={(event) => {
                    onPropertyNameChange(event.target.value);
                  }}
                  error={propertyNameError ?? undefined}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="property-comment"
                className="text-xs text-dashboard-muted"
              >
                Comment (Optional)
              </label>
              <textarea
                id="property-comment"
                value={propertyComment}
                onChange={(e) => onPropertyCommentChange(e.target.value)}
                placeholder="Optional note about this property"
                rows={4}
                className="w-full resize-y rounded-md border border-dashboard-border bg-dashboard-surface px-3 py-2 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:ring-2 focus:ring-dashboard-ring"
              />
            </div>
          </div>
        </fieldset>

        <FormError message={propApiError ?? undefined} />

        <div className="mt-auto flex justify-end gap-2 pt-2">
          <ActionButton
            type="button"
            variant="neutral"
            fullWidth
            className="sm:w-[140px] border-dashboard-border text-dashboard-muted shadow-sm hover:bg-dashboard-hover"
            disabled={propLoading}
            onClick={onBack}
          >
            ← Back
          </ActionButton>

          <ActionButton
            type="button"
            variant="neutral"
            fullWidth
            className={btnClass}
            disabled={propLoading}
            onClick={() => void onSave()}
          >
            {propLoading ? "Saving..." : "Save Property"}
          </ActionButton>
        </div>
      </div>
    </>
  );
}
