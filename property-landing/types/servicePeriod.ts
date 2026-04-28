/**
 * ServicePeriod type — mirrors ServicePeriodSerializer fields (id + name only).
 * Used for the billing period filter dropdown.
 */
export type ServicePeriod = {
  id: number;
  name: string;
};
