"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import type { CreatePropertyResponse } from "@/types/property";
import apiClient from "@/utils/api/apiClient";

export type PropertyOwner = {
  id: number;
  user_email?: string;
  display_name?: string;
  comment?: string;
};

export type Property = {
  id: number;
  name: string;
  comment?: string;
  owners?: PropertyOwner[];
};

export type Block = {
  id: number;
  name: string;
  comment?: string;
  properties?: Property[];
};

type AdminCompany = {
  id: number;
  name: string;
};

type CompaniesResponse = {
  results?: AdminCompany[];
};

function normalizeCompanies(data: unknown): AdminCompany[] {
  if (Array.isArray(data)) {
    return data as AdminCompany[];
  }

  const maybePaginated = data as CompaniesResponse;
  if (Array.isArray(maybePaginated?.results)) {
    return maybePaginated.results;
  }

  return [];
}

/**
 * useBlocksManager
 *
 * Centralizes block/property CRUD state and side-effects so the page component
 * stays focused on layout and UI composition.
 */
export function useBlocksManager() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [newBlockName, setNewBlockName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createBlockError, setCreateBlockError] = useState<string | null>(null);
  const [adminCompanies, setAdminCompanies] = useState<AdminCompany[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);

  const [selectedEditBlock, setSelectedEditBlock] = useState<Block | null>(null);
  const [isEditBlockModalOpen, setIsEditBlockModalOpen] = useState(false);
  const [isEditBlockSaving, setIsEditBlockSaving] = useState(false);
  const [editBlockError, setEditBlockError] = useState<string | null>(null);

  const [pendingDeleteBlock, setPendingDeleteBlock] = useState<Block | null>(null);
  const [isDeleteBlockModalOpen, setIsDeleteBlockModalOpen] = useState(false);
  const [isDeletingBlock, setIsDeletingBlock] = useState(false);

  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isPropertyDetailsOpen, setIsPropertyDetailsOpen] = useState(false);
  const [isPropertyEditOpen, setIsPropertyEditOpen] = useState(false);
  const [isPropertySaving, setIsPropertySaving] = useState(false);
  const [propertyError, setPropertyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [blocksResponse, companiesResponse] = await Promise.all([
          apiClient.get("/properties/blocks/"),
          apiClient.get("/users/companies/"),
        ]);

        setBlocks(blocksResponse.data);

        const companies = normalizeCompanies(companiesResponse.data);
        setAdminCompanies(companies);
      } catch {
        toast.error("Failed to load blocks.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (adminCompanies.length === 1) {
      setSelectedCompanyId(adminCompanies[0].id);
      return;
    }

    setSelectedCompanyId((prev) => {
      if (prev && adminCompanies.some((company) => company.id === prev)) {
        return prev;
      }
      return null;
    });
  }, [adminCompanies]);

  const handleCreate = async () => {
    const name = newBlockName.trim();
    if (!name) return;

    setCreateBlockError(null);

    if (adminCompanies.length > 1 && !selectedCompanyId) {
      const message = "Please select company.";
      setCreateBlockError(message);
      toast.error(message);
      return;
    }

    setCreating(true);

    try {
      const payload: { name: string; company?: number } = { name };

      if (adminCompanies.length > 1 && selectedCompanyId) {
        payload.company = selectedCompanyId;
      }

      const res = await apiClient.post("/properties/blocks/", payload);
      setBlocks((prev) => [...prev, res.data]);
      setNewBlockName("");
      setIsOpen(false);
      setCreateBlockError(null);
      toast.success("Block created successfully.");
    } catch (unknownError: unknown) {
      const maybeError = unknownError as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
      };

      const message =
        maybeError.response?.data?.detail ||
        maybeError.response?.data?.message ||
        "Failed to create block.";

      setCreateBlockError(message);
      toast.error(message);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteRequest = (id: number) => {
    const block = blocks.find((item) => item.id === id) ?? null;
    setPendingDeleteBlock(block);
    setIsDeleteBlockModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteBlock) return;

    setIsDeletingBlock(true);

    try {
      await apiClient.delete(`/properties/blocks/${pendingDeleteBlock.id}/`);
      setBlocks((prev) => prev.filter((b) => b.id !== pendingDeleteBlock.id));
      setSelectedBlock((prev) => (prev?.id === pendingDeleteBlock.id ? null : prev));
      setPendingDeleteBlock(null);
      setIsDeleteBlockModalOpen(false);
      toast.success("Block deleted successfully.");
    } catch {
      toast.error("Failed to delete block.");
    } finally {
      setIsDeletingBlock(false);
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
    setEditBlockError(null);
    setSelectedEditBlock(block);
    setIsEditBlockModalOpen(true);
  };

  const handleOpenPropertyModal = (block: Block) => {
    setSelectedBlock(block);
    setIsPropertyModalOpen(true);
  };

  const handleSave = async (payload: { name: string }) => {
    if (!selectedEditBlock) return;

    setIsEditBlockSaving(true);
    setEditBlockError(null);

    try {
      await apiClient.put(`/properties/blocks/${selectedEditBlock.id}/`, {
        name: payload.name,
      });

      setBlocks((prev) =>
        prev.map((b) =>
          b.id === selectedEditBlock.id ? { ...b, name: payload.name } : b
        )
      );

      setSelectedBlock((prev) => {
        if (!prev || prev.id !== selectedEditBlock.id) return prev;
        return { ...prev, name: payload.name };
      });

      setSelectedEditBlock((prev) => (prev ? { ...prev, name: payload.name } : prev));
      setIsEditBlockModalOpen(false);
      toast.success("Block updated successfully.");
    } catch (error: unknown) {
      const maybeError = error as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
          };
        };
      };

      setEditBlockError(
        maybeError.response?.data?.detail ||
          maybeError.response?.data?.message ||
          "Failed to update block."
      );
    } finally {
      setIsEditBlockSaving(false);
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

  return {
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
  };
}
