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
  TabIndicator,
  Spinner,
  Text,
} from "@chakra-ui/react";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { statuses } from "@/types/statuses";
import ClientCard from "@/components/clients/ClientCard";
// Icons for statuses
import {
  LuUserPlus,
  LuBadgeCheck,
  LuThumbsUp,
  LuFileCheck2,
} from "react-icons/lu";

const statusIcons: Record<string, React.ReactNode> = {
  ALL: <LuUserPlus />,
  LEAD: <LuUserPlus />,
  PRE_APPROVAL: <LuBadgeCheck />,
  APPROVED: <LuThumbsUp />,
  CLOSED: <LuFileCheck2 />,
};

type Client = {
  id: number | string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  phone?: string;
};

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Fetch clients from API
  useEffect(() => {
    if (!session) return; 

    setLoading(true);
    fetch("/api/clients")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch clients");
        const data = await res.json();
        setClients(data.clients || []);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [session]);

  // Filter clients by status and search term
  const filteredClients = clients.filter((client) => {
    const matchesStatus =
      selectedStatus === "ALL" || client.status === selectedStatus;
    const matchesSearch =
      client.firstName.toLowerCase().includes(search.toLowerCase()) ||
      client.lastName.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (status === "loading")
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading Dashboard...</Text>
      </Box>
    );

  if (!session) return <Text>Please sign in to view your clients.</Text>;

  return (
    <Box>
      <Heading mb={6}>Mortgage Broker Dashboard</Heading>

      {/* Search */}
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
      {/* Tabs with Icons */}
      <Tabs
        mb={6}
        isFitted
        variant="unstyled"
        onChange={(index) => setSelectedStatus(statuses[index])}
        position="relative"
        colorScheme="blue"
      >
        <TabList
          overflowX="auto"
          whiteSpace="nowrap"
          css={{
            "&::-webkit-scrollbar": { display: "none" },
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {statuses.map((status) => (
            <Tab key={status} gap={2} display="flex" alignItems="center">
              {statusIcons[status]} {status}
            </Tab>
          ))}
        </TabList>
        <TabIndicator
          mt="-1.5px"
          height="2px"
          bg="blue.500"
          borderRadius="1px"
        />
      </Tabs>
      {/* Client Cards */}
      {loading ? (
        <Box textAlign="center" mt={10}>
          <Spinner size="xl" />
          <Text mt={4}>Loading client...</Text>
        </Box>
      ) : error ? (
        <Text color="red.500">Error: {error}</Text>
      ) : filteredClients.length === 0 ? (
        <Text>No clients found.</Text>
      ) : (
        <SimpleGrid gap={6}>
          {filteredClients.map((client) => (
            <ClientCard key={client.id} {...client} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
