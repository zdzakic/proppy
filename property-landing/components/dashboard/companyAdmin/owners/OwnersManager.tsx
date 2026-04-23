"use client";

import { useState } from "react";
import { toast } from "sonner";
import TableLayoutToggle from "@/components/dashboard/shared/common/TableLayoutToggle";
import type { TableViewMode } from "@/utils/table/viewMode";
import { useOwnersPage } from "@/hooks/useOwnersPage";
import { usePropertyOwnerSave } from "@/hooks/usePropertyOwnerSave";
import type { PropertyWithMeta } from "@/types/property";
import type { OwnerFormValues } from "@/types/ownerForm";
import OwnersTable from "./OwnersTable";
import OwnerModal from "./OwnerModal";

/** Block id for API paths: prefer root Property.block_id, else nested owners[0].block_id from API. */
function resolveBlockId(property: PropertyWithMeta): number | undefined {
  if (typeof property.block_id === "number") return property.block_id;
  const nested = property.owners?.[0]?.block_id;
  if (typeof nested === "number") return nested;
  return undefined;
}

/**
 * OwnersManager
 *
 * What it does: Composes the Owners page — header, count row, view-mode toggle, table, owner modals.
 * Why it exists: Mirrors CompaniesManager structure; wires assign/update owner modals like AddPropertyModal.
 * What would break if removed: The Owners page would have no layout, data, or owner actions.
 */
export default function OwnersManager() {
  const { properties, loading, error, refetch } = useOwnersPage();
  const [viewMode, setViewMode] = useState<TableViewMode>("auto");

  const { save, isLoading: isSavingOwner, error: saveError, emailApiError, clearErrors } =
    usePropertyOwnerSave();

  const [ownerModalOpen, setOwnerModalOpen] = useState(false);
  const [ownerModalMode, setOwnerModalMode] = useState<"assign" | "edit">("assign");
  const [selectedProperty, setSelectedProperty] = useState<PropertyWithMeta | null>(null);
  /** Increments each time the owner modal opens so OwnerForm remounts with fresh API defaults. */
  const [ownerModalSession, setOwnerModalSession] = useState(0);
  const [modalContextError, setModalContextError] = useState<string | null>(null);

  const openOwnerModal = (property: PropertyWithMeta, mode: "assign" | "edit") => {
    clearErrors();
    setModalContextError(null);
    setOwnerModalMode(mode);
    setOwnerModalSession((s) => s + 1);
    const fresh = properties.find((p) => p.id === property.id) ?? property;
    setSelectedProperty(fresh);
    setOwnerModalOpen(true);
  };

  const closeOwnerModal = () => {
    clearErrors();
    setModalContextError(null);
    setOwnerModalOpen(false);
    setSelectedProperty(null);
  };

  const handleView = (_property: PropertyWithMeta) => {
    // View details modal not in scope for this page — placeholder for future work.
  };

  const handleEdit = (property: PropertyWithMeta) => {
    const hasOwner = Boolean(property.owners?.[0]);
    openOwnerModal(property, hasOwner ? "edit" : "assign");
  };

  const handleDelete = (_property: PropertyWithMeta) => {
    // Delete property flow not implemented on Owners page — placeholder for future work.
  };

  const handleAssignOwner = (property: PropertyWithMeta) => {
    openOwnerModal(property, "assign");
  };

  const handleOwnerSubmit = async (values: OwnerFormValues) => {
    if (!selectedProperty) return;

    const blockId = resolveBlockId(selectedProperty);
    if (blockId == null) {
      setModalContextError(
        "Missing block context for this property. Try refreshing the page.",
      );
      return;
    }

    clearErrors();
    setModalContextError(null);

    const ownerId = selectedProperty.owners?.[0]?.id;

    const ok = await save({
      mode: ownerModalMode,
      blockId,
      propertyId: selectedProperty.id,
      ownerId: ownerModalMode === "edit" ? ownerId : undefined,
      values,
    });

    if (!ok) return;

    await refetch();

    if (ownerModalMode === "edit") {
      toast.success("Owner updated successfully.");
    } else {
      toast.success("Owner assigned successfully.");
    }

    closeOwnerModal();
  };

  if (loading) {
    return <p className="text-sm text-dashboard-muted">Loading properties...</p>;
  }

  const combinedModalError = modalContextError ?? saveError;

  return (
    <>
      <section className="space-y-2 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
        <div className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-dashboard-text">Owners</h1>
              <p className="text-xs text-dashboard-muted">
                All properties and their ownership status.
              </p>
            </div>
          </div>

          <div className="hidden items-center justify-between md:flex">
            {error ? (
              <p className="text-xs text-error">{error}</p>
            ) : (
              <p className="text-xs text-dashboard-muted">
                Showing {properties.length} propert{properties.length === 1 ? "y" : "ies"}.
              </p>
            )}

            <TableLayoutToggle
              value={viewMode}
              onChange={setViewMode}
              ariaLabelPrefix="Owners"
            />
          </div>

          {error ? <p className="text-xs text-error md:hidden">{error}</p> : null}
        </div>

        <OwnersTable
          properties={properties}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAssignOwner={handleAssignOwner}
          viewMode={viewMode}
        />
      </section>

      <OwnerModal
        isOpen={ownerModalOpen}
        onClose={closeOwnerModal}
        mode={ownerModalMode}
        formSession={ownerModalSession}
        property={selectedProperty}
        isSubmitting={isSavingOwner}
        error={combinedModalError}
        emailApiError={emailApiError}
        onClearErrors={clearErrors}
        onSubmit={(values) => void handleOwnerSubmit(values)}
      />
    </>
  );
}
