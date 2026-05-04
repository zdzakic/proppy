/**
 * Shared payment types.
 *
 * Why here: PaymentRow was defined inside PaymentsTable (UI component) and
 * imported by multiple components — types don't belong in UI files.
 * PDFPaymentRow is a PDF-specific subset used by ServiceChargePDFDocument.
 */

export type PaymentRow = {
  id: number;
  amount: string | number;
  date_paid: string;
  comment: string;
  transaction_type: number | null;
  transaction_type_name: string | null;
  property_name: string;
  display_label: string;
};

/** Subset used by ServiceChargePDFDocument — PDF does not need transaction fields. */
export type PDFPaymentRow = {
  id: number;
  amount: string | number;
  date_paid: string;
  comment: string;
};
