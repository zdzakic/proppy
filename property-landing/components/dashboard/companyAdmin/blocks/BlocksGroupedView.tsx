"use client";

import { useMemo } from "react";
import TableLayoutToggle from "@/components/dashboard/shared/common/TableLayoutToggle";
import BlocksTable from "./BlocksTable";
import type { Block } from "@/types/Block";
import type { TableViewMode } from "@/utils/table/viewMode";

type Props = {
  blocks: Block[];
  onEditStart: (block: Block) => void;
  onAddProperty: (block: Block) => void;
  onDetails: (id: number) => void;
  onDelete: (id: number) => void;
  onAddBlock?: (companyId: number) => void;
  viewMode?: TableViewMode;
  onViewModeChange?: (mode: TableViewMode) => void;
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
  onViewModeChange,
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
    <div className="space-y-2">
      {onViewModeChange ? (
        <div className="hidden items-center justify-end md:flex">
          <TableLayoutToggle
            value={viewMode}
            onChange={onViewModeChange}
            ariaLabelPrefix="Blocks"
          />
        </div>
      ) : null}

      {Object.entries(groupedBlocks).map(([companyId, group]) => (
        <div key={companyId}>
          <BlocksTable
            blocks={group.blocks}
            onEditStart={onEditStart}
            onAddProperty={onAddProperty}
            onDetails={onDetails}
            onDelete={onDelete}
            viewMode={viewMode}
            headerTitle={group.company_name}
          />
        </div>
      ))}
    </div>
  );
}