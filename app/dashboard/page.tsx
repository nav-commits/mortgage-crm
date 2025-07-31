"use client";

import {
  SimpleGrid,
  Heading,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  VisuallyHidden,
  FormControl,
} from "@chakra-ui/react";
import ClientCard from "@/components/clients/ClientCard";
import { fakeClients } from "@/data/mockdata";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  console.log("Session data:", session, status);

  const [search, setSearch] = useState<string>("");

  const filteredClients = fakeClients.filter(
    (client) =>
      client.firstName.toLowerCase().includes(search.toLowerCase()) ||
      client.lastName.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Heading mb={6}>Mortgage Broker Dashboard</Heading>
      {/* Accessible Search Input */}
      <FormControl mb={6}>
        <VisuallyHidden>
          <label htmlFor="client-search">Search clients</label>
        </VisuallyHidden>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Box color="gray.500" pl={1}>
              <FiSearch aria-hidden="true" />
            </Box>
          </InputLeftElement>
          <Input
            id="client-search"
            type="search"
            role="searchbox"
            placeholder="Search clients"
            aria-label="Search clients by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            _placeholder={{ color: "gray.500" }}
            _focus={{
              borderColor: "blue.400",
              boxShadow: "outline",
            }}
          />
        </InputGroup>
      </FormControl>
      {/* Client Grid */}
      <SimpleGrid gap={6}>
        {filteredClients.map((client) => (
          <ClientCard key={client.id} {...client} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
