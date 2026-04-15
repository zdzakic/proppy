"use client";

import { useMemo } from "react";
import BlocksTable from "./BlocksTable";
import type { Block } from "@/types/Block";


type Props = {
  blocks: Block[];
  onEditStart: (block: Block) => void;
  onAddProperty: (block: Block) => void;
  onDetails: (id: number) => void;
  onDelete: (id: number) => void;
  onAddBlock?: (companyId: number) => void;
  viewMode?: "table" | "cards" | "auto";
};

/**
 * BlocksGroupedView
 *
 * ŠTA RADI:
 * - grupiše blokove po firmi
 * - renderuje tabelu po firmi
 *
 * ZAŠTO:
 * - bolji UX za multi-company prikaz
 * - skalabilno za Proppy (blocks, properties, owners)
 */
export default function BlocksGroupedView({
  blocks,
  onEditStart,
  onAddProperty,
  onDetails,
  onDelete,
  viewMode = "auto",
}: Props) {
  const groupedBlocks = useMemo(() => {
    return blocks.reduce((acc, block) => {
      const key = block.company;

      if (!acc[key]) {
        acc[key] = {
          company_name: block.company_name,
          blocks: [],
        };
      }

      acc[key].blocks.push(block);
      return acc;
    }, {} as Record<number, { company_name: string; blocks: Block[] }>);
  }, [blocks]);

  return (
    <div className="space-y-6">
      {Object.entries(groupedBlocks).map(([companyId, group]) => (
        <div key={companyId} className="space-y-2">
          {/* HEADER */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-dashboard-text">
              {group.company_name} ({group.blocks.length})
            </h3>
          </div> 

          {/* TABLE */}
          <BlocksTable
            blocks={group.blocks}
            onEditStart={onEditStart}
            onAddProperty={onAddProperty}
            onDetails={onDetails}
            onDelete={onDelete}
            viewMode={viewMode}
          />
        </div>
      ))}
    </div>
  );
}