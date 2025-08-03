import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma";
import { S3 } from "aws-sdk";

const s3 = new S3({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const clients = await prisma.client.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { files: true }, 
    });

    return NextResponse.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    // Extract client fields
    const firstName = formData.get("firstName")?.toString().trim() || "";
    const lastName = formData.get("lastName")?.toString().trim() || "";
    const email = formData.get("email")?.toString().trim() || "";
    const phone = formData.get("phone")?.toString().trim() || null;

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Missing required client fields" }, { status: 400 });
    }

    // Get uploaded files (input name="files", multiple)
    const files = formData.getAll("files") as File[];

    // Find user in DB
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create client record linked to user
    const client = await prisma.client.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        userId: user.id,
      },
    });

    for (const file of files) {
      if (!file || !file.name) continue; 

      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

      const uploadResult = await s3
        .upload({
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: fileName,
          Body: buffer,
          ContentType: file.type,
        })
        .promise();

      await prisma.file.create({
        data: {
          fileName: file.name,
          fileUrl: uploadResult.Location,
          clientId: client.id,
        },
      });
    }

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error("Error creating client and uploading files:", error);
    return NextResponse.json({ error: "Failed to create client and upload files" }, { status: 500 });
  }
}
