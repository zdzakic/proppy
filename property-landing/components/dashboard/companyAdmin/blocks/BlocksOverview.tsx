
"use client";

import { useEffect, useState } from "react";
import apiClient from "@/utils/api/apiClient";
import FormError from "@/components/ui/FormError";

type Property = {
  id: number;
  name: string;
};

type Block = {
  id: number;
  name: string;
  properties?: Property[];
};

export default function BlocksOverview() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await apiClient.get("/properties/blocks/");
        setBlocks(response.data as Block[]);
      } catch {
        setError("Failed to fetch blocks.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  return (
    <section className="space-y-6 rounded-2xl border border-dashboard-border bg-dashboard-surface p-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-dashboard-text">Blocks Overview</h2>
        <p className="text-sm text-dashboard-muted">Overview of blocks and assigned properties.</p>
      </div>

      <FormError message={error} />
      {loading && <p className="text-sm text-dashboard-muted">Loading blocks...</p>}

      {!loading && !error && blocks.length === 0 && (
        <p className="text-sm text-dashboard-muted">No blocks available.</p>
      )}

      {!loading && !error && blocks.length > 0 && (
        <div className="space-y-3">
          {blocks.map((block) => (
            <article
              key={block.id}
              className="rounded-lg border border-dashboard-border bg-dashboard-surface p-4"
            >
              <h3 className="text-base font-semibold text-dashboard-text">{block.name}</h3>

              {block.properties && block.properties.length > 0 ? (
                <ul className="mt-3 space-y-1">
                  {block.properties.map((property) => (
                    <li key={property.id} className="text-sm text-dashboard-muted">
                      {property.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-dashboard-muted">No properties in this block.</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
