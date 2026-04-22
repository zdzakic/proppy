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
  block_name?: string;
  company_name?: string;
};

export interface PropertyDetails {
  id: number;
  name: string;
  comment?: string;
  owners?: PropertyOwner[];
}

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

/**
 * PropertyWithMeta
 *
 * What it does: Extends Property with block and company context returned by the /all/ endpoint.
 * Why it exists: The flat-list endpoint includes denormalised block_name/company_name fields
 *   that the nested Block→Property shape does not carry.
 * What would break if removed: OwnersTable would lose Block and Company column data.
 */
export type PropertyWithMeta = {
  id: number;
  name: string;
  comment?: string;
  owners?: PropertyOwner[];
  block_name?: string;
  company_name?: string;
};
