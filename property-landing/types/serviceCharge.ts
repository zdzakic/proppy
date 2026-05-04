/**
 * ServiceCharge type — mirrors ServiceChargeListSerializer fields from the backend.
 * Shared here so page, manager, and future components import from one place.
 */
export type ServiceChargeStatus = "paid" | "partial" | "unpaid";

export type ServiceCharge = {
  id: number;
  company_id: number;
  company_name: string;
  block_name: string;
  property_name: string;
  owner_name: string;
  period_name: string;
  amount: number;
  paid: number;
  remaining: number;
  status: ServiceChargeStatus;
  last_payment_date: string | null;
  notice_sent_at: string | null;
};
