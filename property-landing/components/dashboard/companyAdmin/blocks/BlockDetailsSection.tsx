"use client";

import { Plus } from "lucide-react";

import ActionButton from "@/components/ui/ActionButton";
import TableLayoutToggle from "@/components/dashboard/shared/common/TableLayoutToggle";
import type { TableViewMode } from "@/utils/table/viewMode";
import type { Block, Property } from "@/hooks/useBlocksManager";
import PropertiesTable from "@/components/dashboard/companyAdmin/properties/PropertiesTable";

type BlockDetailsSectionProps = {
  selectedBlock: Block | null;
  detailsLoading: boolean;
  propertiesViewMode: TableViewMode;
  onPropertiesViewModeChange: (mode: TableViewMode) => void;
  onOpenPropertyModal: () => void;
  onPropertyDetails: (property: Property) => void;
  onPropertyEdit: (property: Property) => void;
  onPropertyDelete: (property: Property) => void;
};

/**
 * BlockDetailsSection
 *
 * Keeps block details UI isolated from the main manager container.
 */
export default function BlockDetailsSection({
  selectedBlock,
  detailsLoading,
  propertiesViewMode,
  onPropertiesViewModeChange,
  onOpenPropertyModal,
  onPropertyDetails,
  onPropertyEdit,
  onPropertyDelete,
}: BlockDetailsSectionProps) {
  return (
    <section className="mt-6 space-y-2 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-dashboard-text">Block Details</h2>
            <p className="text-xs text-dashboard-muted">
              Review properties and manage units inside the selected block.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedBlock && (
              <ActionButton
                onClick={onOpenPropertyModal}
                variant="neutral"
                fullWidth
                className="sm:w-auto border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover"
              >
                <Plus size={16} />
                Add Property
              </ActionButton>
            )}
          </div>
        </div>

        {selectedBlock ? (
          <div className="hidden items-center justify-between md:flex">
            <p className="text-sm font-normal text-dashboard-text">
              {selectedBlock.name}
              <span className="ml-1 text-xs font-normal text-dashboard-muted">
                · {selectedBlock.properties?.length ?? 0} properties
              </span>
            </p>

            <TableLayoutToggle
              value={propertiesViewMode}
              onChange={onPropertiesViewModeChange}
              ariaLabelPrefix="Properties"
            />
          </div>
        ) : null}
      </div>

      {detailsLoading && (
        <p className="text-xs text-dashboard-muted">Loading block details...</p>
      )}

      {!detailsLoading && selectedBlock && (
        <div className="space-y-2">
          <PropertiesTable
            properties={selectedBlock.properties ?? []}
            onDetails={onPropertyDetails}
            onEdit={onPropertyEdit}
            onDelete={onPropertyDelete}
            viewMode={propertiesViewMode}
          />
        </div>
      )}
    </section>
  );
}
