"use client";

import { Box, VStack, Link as ChakraLink } from "@chakra-ui/react";
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
    >
      <VStack align="start" gap={4}>
        <ChakraLink as={Link} href="/dashboard" fontWeight="semibold">
          Dashboard
        </ChakraLink>
        <ChakraLink as={Link} href="/clients" fontWeight="semibold">
          Clients
        </ChakraLink>
      </VStack>
    </Box>
  );
}
