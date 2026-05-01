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
  /** Short label shown in owners list (e.g. unit / role). */
  display_label?: string;
  comment?: string;
  /** Same as Property.block_id — included on nested owner for owner URL construction. */
  block_id?: number;
  block_name?: string;
  company_name?: string;
  /** Profile fields from linked User (read-only API) — used to pre-fill edit owner modal. */
  user_first_name?: string;
  user_last_name?: string;
  user_phone?: string;
  user_address_1?: string;
  user_postcode?: string;
  user_country?: string;
  user_title?: string;
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
  /** Required for owner create/delete URLs when present from API. */
  block_id?: number;
};
