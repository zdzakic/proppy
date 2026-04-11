"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import apiClient from "@/utils/api/apiClient";
import ActionButton from "@/components/ui/ActionButton";
import { toast } from "sonner";
import type { CreatePropertyResponse } from "@/types/property";

import AddBlockModal from "./AddblockModal";
import AddPropertyModal from "./AddPropertyModal";
import BlocksTable from "./BlocksTable";
import EditPropertyModal from "./EditPropertyModal";
import PropertiesTable from "./PropertiesTable";
import PropertyDetailsModal from "./PropertyDetailsModal";

type Block = {
  id: number;
  name: string;
  comment?: string;
  properties?: Property[];
};

type PropertyOwner = {
  id: number;
  user_email?: string;
  display_name?: string;
  comment?: string;
};

type Property = {
  id: number;
  name: string;
  comment?: string;
  owners?: PropertyOwner[];
};

export default function BlocksManager() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [newBlockName, setNewBlockName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPropertyDetailsOpen, setIsPropertyDetailsOpen] = useState(false);
  const [isPropertyEditOpen, setIsPropertyEditOpen] = useState(false);
  const [isPropertySaving, setIsPropertySaving] = useState(false);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await apiClient.get("/properties/blocks/");
        setBlocks(res.data);
      } catch {
        toast.error("Failed to load blocks.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  const handleCreate = async () => {
    const name = newBlockName.trim();
    if (!name) return;

    setCreating(true);

    try {
      const res = await apiClient.post("/properties/blocks/", { name });
      setBlocks((prev) => [...prev, res.data]);
      setNewBlockName("");
      setIsOpen(false);
      toast.success("Block created successfully.");
    } catch {
      toast.error("Failed to create block.");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await apiClient.delete(`/properties/blocks/${id}/`);
      setBlocks((prev) => prev.filter((b) => b.id !== id));
      setSelectedBlock((prev) => (prev?.id === id ? null : prev));
      toast.success("Block deleted successfully.");
    } catch {
      toast.error("Failed to delete block.");
    }
  };

  const handleDetails = async (id: number) => {
    setDetailsLoading(true);

    try {
      const response = await apiClient.get(`/properties/blocks/${id}/`);
      setSelectedBlock(response.data as Block);
    } catch {
      const fallback = blocks.find((block) => block.id === id) ?? null;
      setSelectedBlock(fallback);
      toast.error("Detailed data is not available right now.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleEditStart = (block: Block) => {
    setEditingId(block.id);
    setEditName(block.name);
  };

  const handleOpenPropertyModal = (block: Block) => {
    setSelectedBlock(block);
    setIsPropertyModalOpen(true);
  };

  const handleSave = async (id: number) => {
    try {
      await apiClient.put(`/properties/blocks/${id}/`, {
        name: editName,
      });

      setBlocks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, name: editName } : b))
      );
      setEditingId(null);
      toast.success("Block updated successfully.");
    } catch {
      toast.error("Failed to update block.");
    }
  };

  const handlePropertyCreated = (property: CreatePropertyResponse) => {
    if (!selectedBlock) return;

    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== selectedBlock.id) {
          return block;
        }

        const nextProperties = [
          ...(block.properties ?? []),
          { id: property.id, name: property.name, comment: property.comment ?? "" },
        ];
        return { ...block, properties: nextProperties };
      })
    );

    setSelectedBlock((prev) => {
      if (!prev || prev.id !== selectedBlock.id) {
        return prev;
      }

      return {
        ...prev,
        properties: [
          ...(prev.properties ?? []),
          { id: property.id, name: property.name, comment: property.comment ?? "" },
        ],
      };
    });

    toast.success("Property created successfully.");
  };

  const handlePropertyDetails = (property: Property) => {
    setSelectedProperty(property);
    setIsPropertyDetailsOpen(true);
  };

  const handlePropertyEdit = (property: Property) => {
    setPropertyError(null);
    setSelectedProperty(property);
    setIsPropertyEditOpen(true);
  };

  const handlePropertyDelete = async (property: Property) => {
    if (!selectedBlock) return;

    try {
      await apiClient.delete(
        `/properties/blocks/${selectedBlock.id}/properties/${property.id}/delete/`
      );

      setBlocks((prev) =>
        prev.map((block) => {
          if (block.id !== selectedBlock.id) return block;
          return {
            ...block,
            properties: (block.properties ?? []).filter((item) => item.id !== property.id),
          };
        })
      );

      setSelectedBlock((prev) => {
        if (!prev || prev.id !== selectedBlock.id) return prev;
        return {
          ...prev,
          properties: (prev.properties ?? []).filter((item) => item.id !== property.id),
        };
      });

      if (selectedProperty?.id === property.id) {
        setSelectedProperty(null);
        setIsPropertyDetailsOpen(false);
        setIsPropertyEditOpen(false);
      }

      toast.success("Property deleted successfully.");
    } catch {
      toast.error("Failed to delete property.");
    }
  };

  const handlePropertyUpdate = async (payload: { name: string; comment: string }) => {
    if (!selectedBlock || !selectedProperty) return;

    setIsPropertySaving(true);
    setPropertyError(null);

    try {
      const response = await apiClient.put(
        `/properties/blocks/${selectedBlock.id}/properties/${selectedProperty.id}/`,
        payload
      );

      const updatedProperty: Property = response.data;

      setBlocks((prev) =>
        prev.map((block) => {
          if (block.id !== selectedBlock.id) return block;
          return {
            ...block,
            properties: (block.properties ?? []).map((item) =>
              item.id === updatedProperty.id ? { ...item, ...updatedProperty } : item
            ),
          };
        })
      );

      setSelectedBlock((prev) => {
        if (!prev || prev.id !== selectedBlock.id) return prev;
        return {
          ...prev,
          properties: (prev.properties ?? []).map((item) =>
            item.id === updatedProperty.id ? { ...item, ...updatedProperty } : item
          ),
        };
      });

      setSelectedProperty((prev) => (prev ? { ...prev, ...updatedProperty } : prev));
      setIsPropertyEditOpen(false);
      toast.success("Property updated successfully.");
    } catch (error: unknown) {
      const maybeError = error as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
      };

      setPropertyError(
        maybeError.response?.data?.detail ||
          maybeError.response?.data?.message ||
          "Failed to update property."
      );
    } finally {
      setIsPropertySaving(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-dashboard-muted">Loading blocks...</p>;
  }

  return (
    <>
      <section className="space-y-6 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-dashboard-text">Blocks</h1>
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

        <BlocksTable
          blocks={blocks}
          editingId={editingId}
          editName={editName}
          setEditName={setEditName}
          onEditStart={handleEditStart}
          onAddProperty={handleOpenPropertyModal}
          onDetails={handleDetails}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      </section>

      {(selectedBlock || detailsLoading) && (
        <section className="mt-6 space-y-3 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dashboard-text">Block Details</h2>
            <div className="flex items-center gap-2">
              {selectedBlock && (
                <span className="text-xs text-dashboard-muted">ID: {selectedBlock.id}</span>
              )}

              {selectedBlock && (
                <ActionButton
                  onClick={() => setIsPropertyModalOpen(true)}
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

          {detailsLoading && (
            <p className="text-xs text-dashboard-muted">Loading block details...</p>
          )}

          {!detailsLoading && selectedBlock && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-dashboard-text">{selectedBlock.name}</p>

              <PropertiesTable
                properties={selectedBlock.properties ?? []}
                onDetails={handlePropertyDetails}
                onEdit={handlePropertyEdit}
                onDelete={handlePropertyDelete}
              />
            </div>
          )}
        </section>
      )}

      <AddBlockModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={handleCreate}
        value={newBlockName}
        setValue={setNewBlockName}
        loading={creating}
      />

      <AddPropertyModal
        isOpen={isPropertyModalOpen}
        blockId={selectedBlock?.id ?? null}
        blockName={selectedBlock?.name}
        onClose={() => setIsPropertyModalOpen(false)}
        onCreated={handlePropertyCreated}
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