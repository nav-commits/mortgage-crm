"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";

export default function Home() {
  return (
    <Box p={8}>
      <VStack gap={4} align="start">
        <Heading size="lg">Welcome to the Mortgage CRM</Heading>
        <Text>Edit <code>app/page.tsx</code> to get started.</Text>
        <Text>This is your simple Chakra UI home page.</Text>
      </VStack>
    </Box>
  );
}
