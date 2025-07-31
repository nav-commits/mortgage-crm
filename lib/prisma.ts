// lib/prisma.ts
import { PrismaClient } from "@/app/generated/prisma"; // adjust path if different

export const prisma = new PrismaClient();
