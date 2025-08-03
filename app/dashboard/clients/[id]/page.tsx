"use client";

import {
  Box,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Button,
  useToast,
  Spinner,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface File {
  id: number;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: "LEAD" | "PRE_APPROVAL" | "APPROVED" | "CLOSED";
  files: File[];
}

export default function ClientDetailPage() {
  const { id } = useParams();
  const clientId = Number(id);
  const router = useRouter();
  const toast = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    isOpen: isAlertOpen,
    onOpen: onAlertOpen,
    onClose: onAlertClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function fetchClient() {
      const res = await fetch(`/api/clients/${clientId}`);
      if (!res.ok) {
        setClient(null);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setClient(data.client);
      setLoading(false);
    }

    fetchClient();
  }, [clientId]);

  const handleDelete = async () => {
    const res = await fetch(`/api/clients/${clientId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast({
        title: "Client deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push("/dashboard");
    } else {
      toast({
        title: "Error deleting client.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const statusColorMap = {
    LEAD: "yellow",
    PRE_APPROVAL: "blue",
    APPROVED: "green",
    CLOSED: "gray",
  } as const;

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading client...</Text>
      </Box>
    );
  }

  if (!client) {
    return (
      <Box textAlign="center" mt={10}>
        <Text fontSize="lg" color="red.500">
          Client not found.
        </Text>
      </Box>
    );
  }

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

        {/* Display uploaded files */}
        <Box mt={8} w="100%">
          <Heading size="sm" mb={3}>
            Uploaded Files
          </Heading>

          {client.files.length === 0 && <Text>No files uploaded.</Text>}

          {client.files.length > 0 && (
            <VStack align="start" spacing={2}>
              {client.files.map((file) => (
                <Link
                  key={file.id}
                  href={file.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="blue.500"
                >
                  {file.fileName}
                </Link>
              ))}
            </VStack>
          )}
        </Box>

        <HStack pt={4}>
          <Button
            as={Link}
            href={`/dashboard/clients/${client.id}/edit`}
            colorScheme="blue"
          >
            Edit
          </Button>
          <Button colorScheme="red" variant="outline" onClick={onAlertOpen}>
            Delete
          </Button>
        </HStack>
      </VStack>

      {/* Alert Dialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Client
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this client? This action cannot be
              undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onAlertClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
