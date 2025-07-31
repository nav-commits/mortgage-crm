export type Status = "ALL" | "LEAD" | "PRE_APPROVAL" | "APPROVED" | "CLOSED";

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: Exclude<Status, "ALL">; // clients won't have "ALL"
}
