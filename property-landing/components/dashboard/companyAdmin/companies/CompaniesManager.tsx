"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import ActionButton from "@/components/ui/ActionButton";
import TableLayoutToggle from "@/components/dashboard/shared/common/TableLayoutToggle";
import DeleteConfirmModal from "@/components/dashboard/shared/common/DeleteConfirmModal";
import { useAuth } from "@/context/AuthContext";
import { useCompaniesManager } from "@/hooks/useCompaniesManager";
import type { TableViewMode } from "@/utils/table/viewMode";

import AddCompanyModal from "./AddCompanyModal";
import CompaniesTable from "./CompaniesTable";
import EditCompanyModal from "./EditCompanyModal";

export default function CompaniesManager() {
  const { user } = useAuth();
  const [companiesViewMode, setCompaniesViewMode] = useState<TableViewMode>("auto");

  const {
    companies,
    loading,
    error,
    isAddModalOpen,
    setIsAddModalOpen,
    newCompanyName,
    setNewCompanyName,
    newCompanyAddress,
    setNewCompanyAddress,
    isCreating,
    selectedEditCompany,
    isEditCompanyModalOpen,
    setIsEditCompanyModalOpen,
    isEditCompanySaving,
    editCompanyError,
    pendingDeleteCompany,
    setPendingDeleteCompany,
    isDeleteCompanyModalOpen,
    setIsDeleteCompanyModalOpen,
    isDeletingCompany,
    handleCreateCompany,
    handleEditStart,
    handleEditSave,
    handleDeleteRequest,
    handleDeleteConfirm,
  } = useCompaniesManager(user?.email ?? null);

  if (loading) {
    return <p className="text-sm text-dashboard-muted">Loading companies...</p>;
  }

  return (
    <>
      <section className="space-y-2 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
        <div className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-dashboard-text">Companies</h1>
              <p className="text-xs text-dashboard-muted">
                Manage companies linked to your company admin account.
              </p>
            </div>

            <ActionButton
              onClick={() => setIsAddModalOpen(true)}
              variant="neutral"
              fullWidth
              className="sm:w-auto border-dashboard-ring bg-dashboard-active text-dashboard-text shadow-sm hover:bg-dashboard-hover"
            >
              <Plus size={16} />
              Add Company
            </ActionButton>
          </div>

          <div className="hidden items-center justify-between md:flex">
            {error ? (
              <p className="text-xs text-error">{error}</p>
            ) : (
              <p className="text-xs text-dashboard-muted">
                Showing {companies.length} compan{companies.length === 1 ? "y" : "ies"}.
              </p>
            )}

            <TableLayoutToggle
              value={companiesViewMode}
              onChange={setCompaniesViewMode}
              ariaLabelPrefix="Companies"
            />
          </div>

          {error ? <p className="text-xs text-error md:hidden">{error}</p> : null}
        </div>

        <CompaniesTable
          companies={companies}
          onEditStart={handleEditStart}
          onDelete={handleDeleteRequest}
          viewMode={companiesViewMode}
        />
      </section>

      <AddCompanyModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreate={handleCreateCompany}
        value={newCompanyName}
        setValue={setNewCompanyName}
        addressValue={newCompanyAddress}
        setAddressValue={setNewCompanyAddress}
        loading={isCreating}
      />

      <EditCompanyModal
        isOpen={isEditCompanyModalOpen}
        company={selectedEditCompany}
        isSaving={isEditCompanySaving}
        error={editCompanyError}
        onSave={handleEditSave}
        onClose={() => setIsEditCompanyModalOpen(false)}
      />

      <DeleteConfirmModal
        isOpen={isDeleteCompanyModalOpen}
        isSubmitting={isDeletingCompany}
        title="Delete Company"
        description={`Delete company ${pendingDeleteCompany?.name ?? ""}?`}
        confirmLabel="Yes, Delete Company"
        onClose={() => {
          setIsDeleteCompanyModalOpen(false);
          setPendingDeleteCompany(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
