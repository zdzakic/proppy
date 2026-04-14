export interface Company {
  id: number;
  name: string;
  address?: string;
  block_count: number;
  property_count: number;
}

export interface CompaniesListResponse {
  results?: Company[];
}

export interface AddCompanyResponse {
  company_id: number;
  company_name: string;
  company_address?: string;
  message?: string;
}
