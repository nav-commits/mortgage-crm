"use client";

import {
  Box,
  VStack,
  Link as ChakraLink,
  Heading,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useBreakpointValue,
} from "@chakra-ui/react";
import Link from "next/link";

export default function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const isDrawer = useBreakpointValue({ base: true, md: false });

  const sidebarContent = (
    <Box
      as="nav"
      bg="gray.100"
      p={6}
      h="100vh"
      overflowY="auto"
      boxShadow="md"
      w={{ base: "full", md: "220px" }}
      position={{ base: "relative", md: "sticky" }}
      top={{ base: 0, md: "64px" }}
    >
      <VStack align="start" spacing={6}>
        <Heading size="md">Broker Menu</Heading>
        <ChakraLink
          as={Link}
          href="/dashboard"
          fontWeight="semibold"
          w="100%"
          onClick={isDrawer ? onClose : undefined}
        >
          Clients
        </ChakraLink>
        <ChakraLink
          as={Link}
          href="/dashboard/add-client"
          fontWeight="semibold"
          w="100%"
          onClick={isDrawer ? onClose : undefined}
        >
          Add Client
        </ChakraLink>
      </VStack>
    </Box>
  );

  if (isDrawer) {
    return (
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>{sidebarContent}</DrawerContent>
      </Drawer>
    );
  }

  return sidebarContent;
}
