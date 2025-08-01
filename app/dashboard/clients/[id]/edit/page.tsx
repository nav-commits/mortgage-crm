"use client";

import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  VStack,
  Select,
  useToast,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ClientStatus = "LEAD" | "PRE_APPROVAL" | "APPROVED" | "CLOSED";

interface Client {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  status: ClientStatus;
  notes: string | null;
}

export default function EditClientPage() {
  const { id } = useParams();
  const clientId = Number(id);
  const router = useRouter();
  const toast = useToast();

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    status: "LEAD" as ClientStatus,
    notes: "",
  });

  useEffect(() => {
    async function fetchClient() {
      const res = await fetch(`/api/clients/${clientId}`);
      if (!res.ok) {
        toast({
          title: "Failed to load client",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        return;
      }
      const data = await res.json();
      setClient(data.client);
      setForm({
        firstName: data.client.firstName,
        lastName: data.client.lastName,
        email: data.client.email,
        phone: data.client.phone ?? "",
        status: data.client.status,
        notes: data.client.notes ?? "",
      });
      setLoading(false);
    }
    fetchClient();
  }, [clientId, toast]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update client");

      toast({
        title: "Client updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      router.push(`/dashboard/clients/${clientId}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error updating client",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading client...</Text>
      </Box>
    );

  if (!client) return <Box mt={10}>Client not found.</Box>;

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
      <Heading mb={6}>Edit Client</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Status</FormLabel>
            <Select name="status" value={form.status} onChange={handleChange}>
              <option value="LEAD">Lead</option>
              <option value="PRE_APPROVAL">Pre-Approval</option>
              <option value="APPROVED">Approved</option>
              <option value="CLOSED">Closed</option>
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Notes</FormLabel>
            <Textarea name="notes" value={form.notes} onChange={handleChange} />
          </FormControl>
          <Button type="submit" colorScheme="blue" isLoading={submitting}>
            Update Client
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
