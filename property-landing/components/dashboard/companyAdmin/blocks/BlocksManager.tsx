"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import ActionButton from "@/components/ui/ActionButton";
import type { TableViewMode } from "@/utils/table/viewMode";
import DeleteConfirmModal from "@/components/dashboard/shared/common/DeleteConfirmModal";
import { useBlocksManager } from "@/hooks/useBlocksManager";

import AddBlockModal from "./AddblockModal";
import AddPropertyModal from "./AddPropertyModal";
import BlocksTable from "./BlocksTable";
import EditBlockModal from "./EditBlockModal";
import EditPropertyModal from "../properties/EditPropertyModal";
import PropertyDetailsModal from "../properties/PropertyDetailsModal";
import BlockDetailsModal from "./BlockDetailsModal";
import BlocksGroupedView from "./BlocksGroupedView";

export default function BlocksManager() {
  const {
    blocks,
    loading,
    isOpen,
    setIsOpen,
    newBlockName,
    setNewBlockName,
    creating,
    createBlockError,
    adminCompanies,
    selectedCompanyId,
    setSelectedCompanyId,
    selectedEditBlock,
    isEditBlockModalOpen,
    setIsEditBlockModalOpen,
    isEditBlockSaving,
    editBlockError,
    pendingDeleteBlock,
    setPendingDeleteBlock,
    isDeleteBlockModalOpen,
    setIsDeleteBlockModalOpen,
    isDeletingBlock,
    selectedBlock,
    detailsLoading,
    isPropertyModalOpen,
    setIsPropertyModalOpen,
    selectedProperty,
    isPropertyDetailsOpen,
    setIsPropertyDetailsOpen,
    isPropertyEditOpen,
    setIsPropertyEditOpen,
    isPropertySaving,
    propertyError,
    handleCreate,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleDetails,
    handleEditStart,
    handleOpenPropertyModal,
    handleSave,
    handlePropertyCreated,
    handlePropertyDetails,
    handlePropertyEdit,
    handlePropertyDelete,
    handlePropertyUpdate,
  } = useBlocksManager();

  const [blocksViewMode, setBlocksViewMode] = useState<TableViewMode>("auto");
  const [propertiesViewMode, setPropertiesViewMode] = useState<TableViewMode>("auto");
  const [isBlockDetailsOpen, setIsBlockDetailsOpen] = useState(false);

  if (loading) {
    return <p className="text-sm text-dashboard-muted">Loading blocks...</p>;
  }

  return (
    <>
      <section className="space-y-2 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
        <div className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-dashboard-text">Blocks</h1>
              <p className="text-xs text-dashboard-muted">
                Organize building sections and manage their properties.
              </p>
            </div>

            <ActionButton
              onClick={() => setIsOpen(true)}
              variant="neutral"
              fullWidth
              className="sm:w-auto border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover"
            >
              <Plus size={16} />
              Add Block
            </ActionButton>
          </div>
        </div>

        {/* <BlocksTable
          blocks={blocks as any}
          onEditStart={handleEditStart}
          onAddProperty={handleOpenPropertyModal}
          onDetails={(id) => {
            setIsBlockDetailsOpen(true);
            handleDetails(id);
          }}
          onDelete={handleDeleteRequest}
          viewMode={blocksViewMode}
        /> */}
        <BlocksGroupedView
          blocks={blocks as any}
          onEditStart={handleEditStart}
          onAddProperty={handleOpenPropertyModal}
          onDetails={(id) => {
            setIsBlockDetailsOpen(true);
            handleDetails(id);
          }}
          onDelete={handleDeleteRequest}
          onViewModeChange={setBlocksViewMode}
          // onAddBlock={(companyId) => {
          //   setSelectedCompanyId(companyId);
          //   setIsOpen(true);
          // }}
          viewMode={blocksViewMode}
        />
      </section>

      <BlockDetailsModal
        isOpen={isBlockDetailsOpen}
        onClose={() => setIsBlockDetailsOpen(false)}
        selectedBlock={selectedBlock}
        detailsLoading={detailsLoading}
        propertiesViewMode={propertiesViewMode}
        onPropertiesViewModeChange={setPropertiesViewMode}
        onOpenPropertyModal={() => setIsPropertyModalOpen(true)}
        onPropertyDetails={handlePropertyDetails}
        onPropertyEdit={handlePropertyEdit}
        onPropertyDelete={handlePropertyDelete}
      />

      <AddBlockModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={handleCreate}
        value={newBlockName}
        setValue={setNewBlockName}
        loading={creating}
        error={createBlockError}
        companyOptions={adminCompanies}
        selectedCompanyId={selectedCompanyId}
        onCompanyChange={setSelectedCompanyId}
      />

      <AddPropertyModal
        isOpen={isPropertyModalOpen}
        blockId={selectedBlock?.id ?? null}
        blockName={selectedBlock?.name}
        onClose={() => setIsPropertyModalOpen(false)}
        onCreated={handlePropertyCreated}
      />

      <DeleteConfirmModal
        isOpen={isDeleteBlockModalOpen}
        isSubmitting={isDeletingBlock}
        title="Delete Block"
        description={`Delete block ${pendingDeleteBlock?.name ?? ""}? All properties in this block will be removed.`}
        confirmLabel="Yes, Delete Block"
        onClose={() => {
          setIsDeleteBlockModalOpen(false);
          setPendingDeleteBlock(null);
        }}
        onConfirm={handleDeleteConfirm}
      />

      <EditBlockModal
        isOpen={isEditBlockModalOpen}
        block={selectedEditBlock}
        isSaving={isEditBlockSaving}
        error={editBlockError}
        onSave={handleSave}
        onClose={() => setIsEditBlockModalOpen(false)}
      />

      <PropertyDetailsModal
        isOpen={isPropertyDetailsOpen}
        property={selectedProperty}
        blockName={selectedBlock?.name}
        onClose={() => setIsPropertyDetailsOpen(false)}
      />

      <EditPropertyModal
        isOpen={isPropertyEditOpen}
        property={selectedProperty}
        isSaving={isPropertySaving}
        error={propertyError}
        onSave={handlePropertyUpdate}
        onClose={() => setIsPropertyEditOpen(false)}
      />
    </>
  );
}