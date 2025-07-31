"use client";

import { SimpleGrid, Heading, Box } from "@chakra-ui/react";
import ClientCard from "@/components/clients/ClientCard";
import { fakeClients } from "@/data/mockdata";

export default function DashboardPage() {
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
