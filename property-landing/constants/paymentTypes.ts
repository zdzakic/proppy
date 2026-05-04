export const PAYMENT_TRANSACTION_TYPES = [
  "Service Charge Notice",
  "Incoming",
  "Outgoing",
] as const;

export type PaymentTransactionType = (typeof PAYMENT_TRANSACTION_TYPES)[number];
