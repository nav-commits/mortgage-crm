"use client";

import { Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import { signOut } from "next-auth/react";

export default function Header() {
  return (
    <Flex
      as="header"
      bg="gray.100"
      px={6}
      py={4}
      align="center"
      shadow="md"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Heading size="md">Mortgage CRM</Heading>
      <Spacer />
      <Button onClick={() => signOut({ callbackUrl: "/signin" })}>
      Logout
    </Button>
    </Flex>
  );
}
