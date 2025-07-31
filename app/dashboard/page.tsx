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
  Tabs,
  TabList,
  Tab,
} from "@chakra-ui/react";
import ClientCard from "@/components/clients/ClientCard";
import { fakeClients } from "@/data/mockdata";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { statuses } from "@/types/statuses";
export default function DashboardPage() {
  const { data: session, status } = useSession();
  console.log("Session data:", session, status);
  const [search, setSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");

  const filteredClients = fakeClients.filter((client) => {
    const matchesStatus =
      selectedStatus === "ALL" || client.status === selectedStatus;
    const matchesSearch =
      client.firstName.toLowerCase().includes(search.toLowerCase()) ||
      client.lastName.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <Box>
      <Heading mb={6}>Mortgage Broker Dashboard</Heading>
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
      <Tabs
  mb={6}
  onChange={(index) => setSelectedStatus(statuses[index])}
  colorScheme="blue"
>
  <TabList
    overflowX="auto"
    whiteSpace="nowrap"
    // Optional: hide scrollbar for cleaner look
    css={{
      "&::-webkit-scrollbar": { display: "none" },
      msOverflowStyle: "none",
      scrollbarWidth: "none",
    }}
    
  >
    {statuses.map((status) => (
      <Tab key={status} flexShrink={0}>
        {status}
      </Tab>
    ))}
  </TabList>
</Tabs>

      <SimpleGrid gap={6}>
        {filteredClients.map((client) => (
          <ClientCard key={client.id} {...client} />
        ))}
      </SimpleGrid>
    </Box>
  );
}
