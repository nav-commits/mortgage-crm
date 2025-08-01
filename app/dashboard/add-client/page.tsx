"use client";

import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css"; 
import { useEffect } from "react";

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function AddClientPage() {
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

useEffect(() => {
  register("phone");
}, [register]);

const phoneValue = watch("phone") || "";

  const onSubmit = async (data: ClientFormData) => {
    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to create client");

      const createdClient = await res.json();
      console.log("Client created:", createdClient);

      reset();
      toast({
        title: "Client added.",
        description: "The client was added successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "There was an error adding the client.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <Box maxW="500px" mx="auto" mt={10}>
      <Heading size="lg" mb={6}>
        Add New Client
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.firstName} isRequired>
            <FormLabel>First Name</FormLabel>
            <Input {...register("firstName")} />
            <FormErrorMessage>{errors.firstName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.lastName} isRequired>
            <FormLabel>Last Name</FormLabel>
            <Input {...register("lastName")} />
            <FormErrorMessage>{errors.lastName?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.email} isRequired>
            <FormLabel>Email</FormLabel>
            <Input type="email" {...register("email")} />
            <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.phone}>
            <FormLabel>Phone</FormLabel>
            <ReactPhoneInput
              country={"ca"}
              value={phoneValue}
              onChange={(value) => setValue("phone", value, { shouldValidate: true })}
              inputStyle={{ width: "100%" }}
              inputProps={{
                name: "phone",
                required: false,
                autoFocus: false,
              }}
            />
            <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="blue"
            type="submit"
            w="full"
            isLoading={isSubmitting}
          >
            Save Client
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
