"use client";

import { Flex, Box } from "@chakra-ui/react";
import Header from "./header";
import Sidebar from "./sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Flex height="100vh" direction="column">
      <Header />
      <Flex flex="1" overflow="hidden">
        <Sidebar />
        <Box flex="1" p={6} overflowY="auto">
          {children}
        </Box>
      </Flex>
    </Flex>
  );
}
