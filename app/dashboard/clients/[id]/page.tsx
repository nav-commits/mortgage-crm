import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  Box,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";

interface ClientDetailPageProps {
  params: { id: string };
}

export default async function ClientDetailPage({
  params,
}: ClientDetailPageProps) {
  const clientId = Number(params.id);
  if (isNaN(clientId)) return notFound();

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) return notFound();

  const statusColorMap = {
    LEAD: "yellow",
    PRE_APPROVAL: "blue",
    APPROVED: "green",
    CLOSED: "gray",
  } as const;

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="md"
      shadow="md"
    >
      <VStack align="start" spacing={3}>
        <HStack justifyContent="space-between" w="100%">
          <Heading size="md">
            {client.firstName} {client.lastName}
          </Heading>
          <Badge colorScheme={statusColorMap[client.status]}>
            {client.status}
          </Badge>
        </HStack>

        <Text>
          <strong>Email:</strong> {client.email}
        </Text>
        <Text>
          <strong>Phone:</strong> {client.phone || "N/A"}
        </Text>

        <HStack pt={4}>
          <Button as={Link} href={`/dashboard`} colorScheme="blue">
            Edit
          </Button>
          <Button
            as={Link}
            href={`/dashboard`}
            colorScheme="red"
            variant="outline"
          >
            Delete
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
}
