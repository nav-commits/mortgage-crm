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
  Text,
  List,
  ListItem,
  ListIcon,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ReactPhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useEffect, useState } from "react";
import { MdInsertDriveFile, MdClose } from "react-icons/md";

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function AddClientPage() {
  const toast = useToast();
  // Use an array of File instead of FileList for easier manipulation
  const [files, setFiles] = useState<File[]>([]);

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

  // Handler to add new files (append to existing files)
  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    // Append new files to existing, avoid duplicates by name+size
    setFiles((currentFiles) => {
      const existing = currentFiles.map((f) => f.name + f.size);
      const filteredNew = newFiles.filter(
        (f) => !existing.includes(f.name + f.size)
      );
      return [...currentFiles, ...filteredNew];
    });

    // Reset input so user can re-add the same file if they want
    e.target.value = "";
  };

  // Handler to remove a file by index
  const removeFile = (index: number) => {
    setFiles((currentFiles) => {
      const updated = [...currentFiles];
      updated.splice(index, 1);
      return updated;
    });
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("email", data.email);
      if (data.phone) {
        formData.append("phone", data.phone);
      }

      // Append files
      files.forEach((file) => {
        formData.append("files", file);
      });

      const res = await fetch("/api/clients", {
        method: "POST",
        body: formData, // browser sets Content-Type automatically
      });

      if (!res.ok) throw new Error("Failed to create client");

      toast({
        title: "Client added.",
        description: "Client information was saved successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });

      reset();
      setFiles([]);
    } catch (error) {
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
              onChange={(value) =>
                setValue("phone", value, { shouldValidate: true })
              }
              inputStyle={{ width: "100%" }}
              inputProps={{
                name: "phone",
                required: false,
                autoFocus: false,
              }}
            />
            <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
          </FormControl>

          <FormControl>
            <FormLabel>Upload Files</FormLabel>
            <Input
              type="file"
              multiple
              onChange={onFilesChange}
              // Clear value on focus to allow re-upload same files if needed
              onClick={(e) => {
                (e.target as HTMLInputElement).value = "";
              }}
            />
          </FormControl>

          {/* Show selected files with remove buttons */}
          {files.length > 0 && (
            <Box w="100%" bg="gray.50" p={3} borderRadius="md" boxShadow="sm">
              <Text fontWeight="bold" mb={2}>
                Selected files:
              </Text>
              <List spacing={1}>
                {files.map((file, idx) => (
                  <ListItem
                    key={`${file.name}-${file.size}-${idx}`}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <HStack>
                      <ListIcon as={MdInsertDriveFile} color="blue.500" />
                      <Text>
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </Text>
                    </HStack>
                    <IconButton
                      aria-label="Remove file"
                      icon={<MdClose />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => removeFile(idx)}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

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
