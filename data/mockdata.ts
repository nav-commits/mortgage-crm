import type { Client } from "@/types/client";

export const fakeClients: Client[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    status: "LEAD",
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    status: "PRE_APPROVAL",
  },
  {
    id: "3",
    firstName: "Bob",
    lastName: "Johnson",
    email: "bob@example.com",
    status: "APPROVED",
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Brown",
    email: "alice@example.com",
    status: "CLOSED",
  },
];
