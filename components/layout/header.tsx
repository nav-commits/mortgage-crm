"use client";

import {
  Flex,
  Heading,
  Spacer,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  Box,
  Icon,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiChevronDown, FiUser } from "react-icons/fi";
import { signOut } from "next-auth/react";
import { FiMenu } from "react-icons/fi";
import Link from "next/link";
export default function Header({ onOpenSidebar }: { onOpenSidebar: () => void }) {
   const showHamburger = useBreakpointValue({ base: true, md: false });
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
       {showHamburger && (
        <IconButton
          aria-label="Open sidebar"
          icon={<FiMenu />}
          onClick={onOpenSidebar}
          mr={4}
          variant="outline"
        />
      )}
      <Link href="/dashboard">
        <Heading size="md">
          Mortgage CRM
        </Heading>
      </Link>
      <Spacer />
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<Icon as={FiChevronDown} />}
          variant="outline"
        >
          <Flex align="center" gap={2}>
            <Icon as={FiUser} boxSize={5} />
            <Box display={{ base: "none", md: "block" }}>Account</Box>
          </Flex>
        </MenuButton>
        <MenuList>
          <MenuItem>Profile</MenuItem>
          <MenuItem>Settings</MenuItem>
          <MenuItem onClick={() => signOut({ callbackUrl: "/signin" })}>
            Logout
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
}
