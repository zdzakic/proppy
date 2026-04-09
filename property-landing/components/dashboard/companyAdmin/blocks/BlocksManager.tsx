"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import apiClient from "@/utils/api/apiClient";
import ActionButton from "@/components/ui/ActionButton";
import { toast } from "sonner";

import AddBlockModal from "./AddblockModal";
import BlocksTable from "./BlocksTable";

type Block = {
  id: number;
  name: string;
  comment?: string;
  properties?: { id: number; name: string }[];
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
      toast.info("Block details loaded.");
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

  if (loading) {
    return <p className="text-sm text-dashboard-muted">Loading blocks...</p>;
  }

  return (
    <section className="space-y-6 rounded-2xl border border-dashboard-border bg-dashboard-surface p-4 sm:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-dashboard-text">Blocks</h1>
          <p className="text-sm text-dashboard-muted">Manage your property blocks.</p>
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

      {/* TABLE */}
      <BlocksTable
        blocks={blocks}
        editingId={editingId}
        editName={editName}
        setEditName={setEditName}
        onEditStart={handleEditStart}
        onDetails={handleDetails}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {(selectedBlock || detailsLoading) && (
        <section className="space-y-3 rounded-lg border border-dashboard-border bg-dashboard-surface p-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-dashboard-text">Block Details</h2>
            {selectedBlock && (
              <span className="text-xs text-dashboard-muted">ID: {selectedBlock.id}</span>
            )}
          </div>

          {detailsLoading && (
            <p className="text-xs text-dashboard-muted">Loading block details...</p>
          )}

          {!detailsLoading && selectedBlock && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-dashboard-text">{selectedBlock.name}</p>

              {selectedBlock.properties && selectedBlock.properties.length > 0 ? (
                <ul className="space-y-1">
                  {selectedBlock.properties.map((property) => (
                    <li key={property.id} className="text-xs text-dashboard-muted">
                      {property.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-dashboard-muted">
                  No property details available for this block.
                </p>
              )}
            </div>
          )}
        </section>
      )}

      {/* MODAL */}
      <AddBlockModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCreate={handleCreate}
        value={newBlockName}
        setValue={setNewBlockName}
        loading={creating}
      />
    </section>
  );
}