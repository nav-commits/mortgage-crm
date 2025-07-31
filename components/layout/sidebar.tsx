"use client";

import { Box, VStack, Link as ChakraLink, Divider, Heading } from "@chakra-ui/react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <Box
      as="nav"
      width="220px"
      bg="gray.100"
      p={6}
      minH="calc(100vh - 64px)"
      position="sticky"
      top="64px"
      overflowY="auto"
      boxShadow="md"
    >
      <VStack align="start" spacing={6}>
        <Heading size="md" mb={4} color="blue.600">
          Broker Menu
        </Heading>

        <ChakraLink as={Link} href="/dashboard" fontWeight="semibold" fontSize="lg" w="100%">
          Dashboard
        </ChakraLink>

        <ChakraLink as={Link} href="/dashboard/clients" fontWeight="semibold" w="100%">
          Clients
        </ChakraLink>

        <ChakraLink as={Link} href="/dashboard/clients/new" fontWeight="semibold" w="100%">
          Add Client
        </ChakraLink>

        <ChakraLink as={Link} href="/dashboard/files" fontWeight="semibold" w="100%">
          Files
        </ChakraLink>

        <Divider />

        <ChakraLink as={Link} href="/dashboard/settings" fontWeight="semibold" w="100%">
          Settings
        </ChakraLink>
      </VStack>
    </Box>
  );
}
