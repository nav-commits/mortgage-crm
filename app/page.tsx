'use client'
import { Box, Heading, Text, VStack, Button, Stack, Icon, Card, CardBody } from "@chakra-ui/react";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
    <Box minH="100vh" bg="gray.50" py={20} px={4}>
      <VStack gap={8} maxW="lg" mx="auto" textAlign="center">
        <Heading size="xl" color="blue.700">
          Welcome to the Mortgage CRM
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Manage your clients, documents, and workflow — all in one place.
        </Text>
        <Stack direction={{ base: "column", sm: "row" }} spacing={6} w="100%">
          <Card variant="outline" w="100%">
            <CardBody>
              <VStack spacing={4}>
                <Icon as={FaUserPlus} boxSize={8} color="teal.500" />
                <Heading size="md">New Here?</Heading>
                <Text fontSize="sm" color="gray.600">
                  Create an account to get started managing clients.
                </Text>
                <Link href="/register" passHref>
                  <Button colorScheme="teal" width="full">
                    Register
                  </Button>
                </Link>
              </VStack>
            </CardBody>
          </Card>
          <Card variant="outline" w="100%">
            <CardBody>
              <VStack spacing={4}>
                <Icon as={FaSignInAlt} boxSize={8} color="blue.500" />
                <Heading size="md">Returning?</Heading>
                <Text fontSize="sm" color="gray.600">
                  Log into your account to access your dashboard.
                </Text>
                <Link href="/signin" passHref>
                  <Button colorScheme="blue" width="full">
                    Login
                  </Button>
                </Link>
              </VStack>
            </CardBody>
          </Card>
        </Stack>
      </VStack>
    </Box>
  );
}
