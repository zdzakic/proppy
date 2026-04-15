"use client";

import { X, Plus } from "lucide-react";

import ActionButton from "@/components/ui/ActionButton";
import TableLayoutToggle from "@/components/dashboard/shared/common/TableLayoutToggle";
import type { TableViewMode } from "@/utils/table/viewMode";
import type { Block } from "@/types/Block";
import type { Property } from "@/types/property";
import PropertiesTable from "@/components/dashboard/companyAdmin/properties/PropertiesTable";

type BlockDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedBlock: Block | null;
  detailsLoading: boolean;
  propertiesViewMode: TableViewMode;
  onPropertiesViewModeChange: (mode: TableViewMode) => void;
  onOpenPropertyModal: () => void;
  onPropertyDetails: (property: Property) => void;
  onPropertyEdit: (property: Property) => void;
  onPropertyDelete: (property: Property) => void;
};

export default function BlockDetailsModal({
  isOpen,
  onClose,
  selectedBlock,
  detailsLoading,
  propertiesViewMode,
  onPropertiesViewModeChange,
  onOpenPropertyModal,
  onPropertyDetails,
  onPropertyEdit,
  onPropertyDelete,
}: BlockDetailsModalProps) {
  if (!isOpen) return null;

  const blockName = selectedBlock?.name ?? "Block details";
  const propertiesCount = selectedBlock?.properties?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-dashboard-sidebar/40 p-3 sm:items-center sm:p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-xl border border-dashboard-border bg-dashboard-surface shadow-premium">
        <div className="flex items-start justify-between gap-3 border-b border-dashboard-border p-4 sm:p-6">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-dashboard-text">{blockName}</h2>
            <p className="text-xs text-dashboard-muted">
              {detailsLoading ? "Loading properties..." : `${propertiesCount} properties`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {selectedBlock ? (
              <ActionButton
                onClick={onOpenPropertyModal}
                variant="neutral"
                className="border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover"
              >
                <Plus size={16} />
                Add Property
              </ActionButton>
            ) : null}

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
          <div className="space-y-2">
            <div className="hidden items-center justify-end md:flex">
              <TableLayoutToggle
                value={propertiesViewMode}
                onChange={onPropertiesViewModeChange}
                ariaLabelPrefix="Properties"
              />
            </div>

            {detailsLoading ? (
              <p className="text-xs text-dashboard-muted">Loading block details...</p>
            ) : null}

            {!detailsLoading && selectedBlock ? (
              <PropertiesTable
                properties={selectedBlock.properties ?? []}
                onDetails={onPropertyDetails}
                onEdit={onPropertyEdit}
                onDelete={onPropertyDelete}
                viewMode={propertiesViewMode}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

