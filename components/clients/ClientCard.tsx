"use client";

import { Box, Text, Badge, VStack } from "@chakra-ui/react";
import type { Client } from "@/types/client";

export default function ClientCard({
  email,
  status,
  firstName,
  lastName,
}: Client) {
  const statusColorMap = {
    Lead: "yellow",
    "Pre-Approval": "blue",
    Approved: "green",
    Closed: "gray",
  } as const;

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      w="100%"
      _hover={{ shadow: "md" }}
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
        <Text color="gray.600">{email}</Text>
        <Badge colorScheme={statusColorMap[status]}>{status}</Badge>
      </VStack>
    </Box>
  );
}
