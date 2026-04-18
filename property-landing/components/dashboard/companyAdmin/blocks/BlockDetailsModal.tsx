"use client";

import { Plus } from "lucide-react";

import ActionButton from "@/components/ui/ActionButton";
import BaseModal from "@/components/ui/modal/BaseModal";
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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={blockName}
      subtitle={detailsLoading ? "Loading properties..." : `${propertiesCount} properties`}
      actions={
        selectedBlock ? (
          <ActionButton
            onClick={onOpenPropertyModal}
            variant="neutral"
            className="border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover"
          >
            <Plus
              size={16}
              className="shrink-0 dark:text-dashboard-accent"
              aria-hidden
            />
            Add Property
          </ActionButton>
        ) : null
      }
      maxWidthClassName="max-w-5xl"
    >
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

      <div className="mt-4 flex justify-end">
        <ActionButton
          onClick={onClose}
          variant="neutral"
          className="border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover"
        >
          Close
        </ActionButton>
      </div>
    </BaseModal>
  );
}

