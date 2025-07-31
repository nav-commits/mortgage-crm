"use client";

import { SimpleGrid, Heading, Box } from "@chakra-ui/react";
import ClientCard from "@/components/clients/ClientCard";
import { fakeClients } from "@/data/mockdata";
import { useSession } from "next-auth/react";
export default function DashboardPage() {
  const { data: session, status } = useSession();
  console.log("Session data:", session);
  return (
    <Box>
      <Heading mb={6}>Mortgage Broker Dashboard</Heading>
      <SimpleGrid gap={6}>
        {fakeClients.map((client) => (
          <ClientCard key={client.id} {...client} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
