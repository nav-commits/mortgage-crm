// app/dashboard/add-client/page.tsx

"use client";

import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function AddClientPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // You'd send formData to your API route here (POST /api/clients)
    console.log("Submitting:", formData);
  };

  return (
    <Box maxW="500px" mx="auto" mt={10}>
      <Heading size="lg" mb={6}>Add New Client</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl isRequired>
            <FormLabel>First Name</FormLabel>
            <Input name="firstName" onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input name="lastName" onChange={handleChange} />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" name="email" onChange={handleChange} />
          </FormControl>

          <FormControl>
            <FormLabel>Phone</FormLabel>
            <Input name="phone" onChange={handleChange} />
          </FormControl>

          <Button colorScheme="blue" type="submit" w="full">
            Save Client
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
