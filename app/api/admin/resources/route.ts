import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

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

    // Obtener el recurso actual para comparar fileUrl
    const currentResource = await prisma.resource.findUnique({
      where: { id: data.id },
    });

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

    // Si el fileUrl cambió y el anterior estaba en public/resources, borrarlo
    if (
      currentResource?.fileUrl &&
      currentResource.fileUrl !== data.fileUrl &&
      currentResource.fileUrl.startsWith("/resources/")
    ) {
      const fileName = currentResource.fileUrl.split("/").pop();
      if (fileName) {
        const filePath = join(process.cwd(), "public", "resources", fileName);
        try {
          if (existsSync(filePath)) {
            await unlink(filePath);
            console.log(`Deleted old file: ${filePath}`);
          }
        } catch (fileError) {
          console.error(`Error deleting old file ${filePath}:`, fileError);
          // No fallar si no se puede borrar el archivo
        }
      }
    }

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

    // Obtener el recurso antes de eliminarlo para borrar el archivo físico
    const resource = await prisma.resource.findUnique({
      where: { id },
    });

    const deleted = await prisma.resource.deleteMany({
      where: { id },
    });

    if (deleted.count === 0) {
      // Delete idempotente: si ya no existe, no romper UI.
      return NextResponse.json({ success: true, alreadyDeleted: true });
    }

    // Si el archivo está en public/resources, borrarlo también
    if (resource?.fileUrl && resource.fileUrl.startsWith("/resources/")) {
      const fileName = resource.fileUrl.split("/").pop();
      if (fileName) {
        const filePath = join(process.cwd(), "public", "resources", fileName);
        try {
          if (existsSync(filePath)) {
            await unlink(filePath);
            console.log(`Deleted file: ${filePath}`);
          }
        } catch (fileError) {
          console.error(`Error deleting file ${filePath}:`, fileError);
          // No fallar si no se puede borrar el archivo
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting resource:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete resource" },
      { status: 500 }
    );
  }
}

