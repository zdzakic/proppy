"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import type {
  AddCompanyResponse,
  Company,
  CompaniesListResponse,
} from "@/types/company";
import apiClient from "@/utils/api/apiClient";

function normalizeCompanies(data: unknown): Company[] {
  if (Array.isArray(data)) {
    return data as Company[];
  }

  const maybePaginated = data as CompaniesListResponse;
  if (Array.isArray(maybePaginated?.results)) {
    return maybePaginated.results;
  }

  return [];
}

/**
 * useCompaniesManager
 *
 * Mirrors the existing blocks manager pattern for list + create company flows,
 * while keeping API state isolated from presentational components.
 */
export function useCompaniesManager(userEmail?: string | null) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyAddress, setNewCompanyAddress] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [selectedEditCompany, setSelectedEditCompany] = useState<Company | null>(null);
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
  const [isEditCompanySaving, setIsEditCompanySaving] = useState(false);
  const [editCompanyError, setEditCompanyError] = useState<string | null>(null);

  const [pendingDeleteCompany, setPendingDeleteCompany] = useState<Company | null>(null);
  const [isDeleteCompanyModalOpen, setIsDeleteCompanyModalOpen] = useState(false);
  const [isDeletingCompany, setIsDeletingCompany] = useState(false);
  const [selectedDetailsCompany, setSelectedDetailsCompany] = useState<Company | null>(null);
  const [isCompanyDetailsOpen, setIsCompanyDetailsOpen] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiClient.get("/users/companies/");
        setCompanies(normalizeCompanies(response.data));
      } catch {
        setError("Failed to load companies.");
        toast.error("Failed to load companies.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleCreateCompany = async () => {
    const name = newCompanyName.trim();
    if (!name) return;

    if (!userEmail) {
      const message = "Unable to create company without account email.";
      setError(message);
      toast.error(message);
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await apiClient.post<AddCompanyResponse>(
        "/properties/companies/create/",
        {
          email: userEmail,
          name,
          address: newCompanyAddress.trim(),
        }
      );

      const createdCompany: Company = {
        id: response.data.company_id,
        name: response.data.company_name,
        address: response.data.company_address ?? "",
        block_count:0,
        property_count:0,
      };

      setCompanies((prev) => [...prev, createdCompany]);
      setNewCompanyName("");
      setNewCompanyAddress("");
      setIsAddModalOpen(false);
      toast.success("Company created successfully.");
    } catch {
      setError("Failed to create company.");
      toast.error("Failed to create company.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditStart = (company: Company) => {
    setEditCompanyError(null);
    setSelectedEditCompany(company);
    setIsEditCompanyModalOpen(true);
  };

  const handleEditSave = async (payload: { name: string; address: string }) => {
    if (!selectedEditCompany) return;

    setIsEditCompanySaving(true);
    setEditCompanyError(null);

    try {
      const response = await apiClient.put<Company>(
        `/users/companies/${selectedEditCompany.id}/update/`,
        {
          name: payload.name,
          address: payload.address,
        }
      );

      const updatedCompany = response.data;

      setCompanies((prev) =>
        prev.map((company) =>
          company.id === updatedCompany.id ? updatedCompany : company
        )
      );

      setSelectedEditCompany(updatedCompany);
      setIsEditCompanyModalOpen(false);
      toast.success("Company updated successfully.");
    } catch (unknownError: unknown) {
      const maybeError = unknownError as {
        response?: {
          data?: {
            detail?: string;
            message?: string;
            name?: string[];
          };
        };
      };

      const nameErrors = maybeError.response?.data?.name;

      setEditCompanyError(
        maybeError.response?.data?.detail ||
          maybeError.response?.data?.message ||
          (Array.isArray(nameErrors) ? nameErrors[0] : "") ||
          "Failed to update company."
      );
    } finally {
      setIsEditCompanySaving(false);
    }
  };

  const handleDeleteRequest = (id: number) => {
    const target = companies.find((company) => company.id === id) ?? null;
    setPendingDeleteCompany(target);
    setIsDeleteCompanyModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteCompany) return;

    setIsDeletingCompany(true);

    try {
      await apiClient.delete(`/users/companies/${pendingDeleteCompany.id}/delete/`);

      setCompanies((prev) =>
        prev.filter((company) => company.id !== pendingDeleteCompany.id)
      );

      setPendingDeleteCompany(null);
      setIsDeleteCompanyModalOpen(false);
      toast.success("Company deleted successfully.");
    } catch {
      toast.error("Failed to delete company.");
    } finally {
      setIsDeletingCompany(false);
    }
  };

  const handleDetails = (company: Company) => {
    setSelectedDetailsCompany(company);
    setIsCompanyDetailsOpen(true);
  };

  return {
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
    selectedDetailsCompany,
    isCompanyDetailsOpen,
    setIsCompanyDetailsOpen,
    handleCreateCompany,
    handleEditStart,
    handleEditSave,
    handleDeleteRequest,
    handleDeleteConfirm,
    handleDetails,
  };
}
