export interface Company {
  id: number;
  name: string;
  address?: string;
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
