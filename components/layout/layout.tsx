"use client";

import { Flex, Box, useDisclosure } from "@chakra-ui/react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex height="100vh" direction="column" overflow="hidden">
      <Header onOpenSidebar={onOpen} />
      <Flex flex="1" overflow="hidden">
        <Sidebar isOpen={isOpen} onClose={onClose} />
        <Box flex="1" p={6} overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
