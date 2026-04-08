"use client";

import { useEffect, useState } from "react";
import apiClient from "@/utils/api/apiClient";
import Button from "@/components/ui/Button";
import FormInput from "@/components/ui/FormInput";
import FormError from "@/components/ui/FormError";

type Block = {
  id: number;
  name: string;
};

export default function BlocksManager() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [newBlockName, setNewBlockName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await apiClient.get("/properties/blocks/");
        setBlocks(response.data);
      } catch {
        setError("Failed to fetch blocks.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  const handleCreateBlock = async () => {
    const name = newBlockName.trim();
    if (!name) return;

    setCreating(true);
    setError("");

    try {
      const response = await apiClient.post("/properties/blocks/", { name });
      setBlocks((prev) => [...prev, response.data]);
      setNewBlockName("");
    } catch {
      setError("Failed to create block.");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBlock = async (id: number) => {
    setError("");

    try {
      await apiClient.delete(`/properties/blocks/${id}/`);
      setBlocks((prev) => prev.filter((block) => block.id !== id));
    } catch {
      setError("Failed to delete block.");
    }
  };

  return (
    <section className="space-y-6 rounded-2xl border border-dashboard-border bg-dashboard-surface p-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-dashboard-text">Blocks Manager</h2>
        <p className="text-sm text-dashboard-muted">Create and manage property blocks.</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <FormInput
          placeholder="Enter block name"
          value={newBlockName}
          onChange={(e) => setNewBlockName(e.target.value)}
          onFocus={() => setError("")}
        />

        <Button
          onClick={handleCreateBlock}
          disabled={creating || !newBlockName.trim()}
          className="w-full sm:w-auto sm:min-w-[150px] border border-dashboard-border bg-dashboard-surface text-dashboard-text hover:bg-dashboard-hover disabled:opacity-60"
        >
          {creating ? "Creating..." : "Create"}
        </Button>
      </div>

      <FormError message={error} />
      {loading && <p className="text-sm text-dashboard-muted">Loading blocks...</p>}

      {!loading && blocks.length === 0 && (
        <p className="text-sm text-dashboard-muted">No blocks available.</p>
      )}

      {!loading && blocks.length > 0 && (
        <ul className="space-y-2">
          {blocks.map((block) => (
            <li
              key={block.id}
              className="flex items-center justify-between rounded-lg border border-dashboard-border bg-dashboard-surface px-3 py-2"
            >
              <span className="text-sm font-medium text-dashboard-text">{block.name}</span>
              <Button
                onClick={() => handleDeleteBlock(block.id)}
                className="w-auto min-w-0 rounded-md border border-dashboard-border bg-transparent px-3 py-1 text-xs font-medium text-dashboard-text hover:bg-dashboard-hover"
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
