import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

async function deleteFromS3(fileKey: string) {
  const bucket = process.env.AWS_BUCKET_NAME!;
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: fileKey,
  });
  await s3.send(command);
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clientId = Number(params.id);
  if (isNaN(clientId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: { files: true },
  });

  if (!client || client.userId !== user.id) {
    return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 404 });
  }

  return NextResponse.json({ client });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const body = await req.json();

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client || client.userId !== user.id) {
    return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 404 });
  }

  const updated = await prisma.client.update({
    where: { id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      status: body.status,
      notes: body.notes,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const client = await prisma.client.findUnique({
    where: { id },
    include: { files: true },
  });

  if (!client || client.userId !== user.id) {
    return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 404 });
  }

  for (const file of client.files) {
    const key = new URL(file.fileUrl).pathname.slice(1);
    try {
      await deleteFromS3(key);
    } catch (err) {
      console.error(`Failed to delete S3 file: ${key}`, err);
    }
  }

  // Delete files from DB
  await prisma.file.deleteMany({
    where: { clientId: id },
  });

  // Delete client
  await prisma.client.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Client and files deleted" });
}
