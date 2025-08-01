import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    const clientId = Number(params.id);
    if (isNaN(clientId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }
  
    const client = await prisma.client.findUnique({
      where: { id: clientId },
    });
  
    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }
  
    return NextResponse.json({ client });
  }
  

// PATCH to update client
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

  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client || client.userId !== user?.id) {
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

// DELETE client
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

  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client || client.userId !== user?.id) {
    return NextResponse.json({ error: "Client not found or unauthorized" }, { status: 404 });
  }

  await prisma.client.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Client deleted" });
}
