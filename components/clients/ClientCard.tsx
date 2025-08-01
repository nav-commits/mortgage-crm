"use client";

import { Box, Text, Badge, VStack } from "@chakra-ui/react";
import Link from "next/link";
import type { Client } from "@/types/client";

export default function ClientCard({
  id,
  email,
  status,
  firstName,
  lastName,
}: Client) {
  const statusColorMap = {
    LEAD: "yellow",
    PRE_APPROVAL: "blue",
    APPROVED: "green",
    CLOSED: "gray",
  } as const;

  return (
    <Link href={`/dashboard/clients/${id}`}>
      <Box
        borderWidth="1px"
        borderRadius="md"
        p={4}
        w="100%"
        _hover={{ shadow: "md", backgroundColor: "gray.50" }}
        cursor="pointer"
      >
        <VStack align="start" gap={1}>
          <Box display="flex" gap={1}>
            <Text fontWeight="bold" fontSize="lg">
              {firstName}
            </Text>
            <Text fontWeight="bold" fontSize="lg">
              {lastName}
            </Text>
          </Box>
          <Text color="gray.600">Email: {email}</Text>
          <Badge colorScheme={statusColorMap[status]}>{status}</Badge>
        </VStack>
      </Box>
    </Link>
  );
}
