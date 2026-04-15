export type Property = {
  id: number;
  name: string;
  comment?: string;
  owners?: PropertyOwner[];
};

export type PropertyOwner = {
  id: number;
  user_email?: string;
  display_name?: string;
  comment?: string;
};

export interface CreatePropertyResponse {
  id: number;
  name: string;
  comment: string;
  owners?: unknown[];
}

export type CreatePropertyPayload = {
  name: string;
  comment: string;
};
