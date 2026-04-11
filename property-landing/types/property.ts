export interface Property {
  id: number;
  name: string;
  comment: string;
}

export interface CreatePropertyPayload {
  name: string;
  comment: string;
}

export interface CreatePropertyResponse {
  id: number;
  name: string;
  comment: string;
  owners?: unknown[];
}
