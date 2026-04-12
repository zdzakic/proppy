export interface Company {
  id: number;
  name: string;
}

export interface CompaniesListResponse {
  results?: Company[];
}

export interface AddCompanyResponse {
  company_id: number;
  company_name: string;
  message?: string;
}
