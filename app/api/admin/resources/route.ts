import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const resources = await prisma.resource.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Validar campos requeridos
    if (!data.title || !data.description || !data.fileUrl || !data.fileType) {
      return NextResponse.json(
        { error: "Title, description, fileUrl, and fileType are required" },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        tags: data.tags || [],
        image: data.image || null,
        requireEmail: data.requireEmail || false,
      },
    });

    return NextResponse.json(resource);
  } catch (error: any) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create resource" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Validar campos requeridos
    if (!data.title || !data.description || !data.fileUrl || !data.fileType) {
      return NextResponse.json(
        { error: "Title, description, fileUrl, and fileType are required" },
        { status: 400 }
      );
    }

    const resource = await prisma.resource.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        fileUrl: data.fileUrl,
        fileType: data.fileType,
        tags: data.tags || [],
        image: data.image || null,
        requireEmail: data.requireEmail || false,
      },
    });

    return NextResponse.json(resource);
  } catch (error: any) {
    console.error("Error updating resource:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete resource" },
      { status: 500 }
    );
  }
}

