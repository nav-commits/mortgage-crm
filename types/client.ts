export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: "LEAD" | "PRE_APPROVAL" | "APPROVED" | "CLOSED";
};
