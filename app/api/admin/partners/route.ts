import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { v2 as cloudinary } from "cloudinary";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función helper para extraer public_id de URL de Cloudinary
const extractPublicId = (url: string): string | null => {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  
  const urlParts = url.split("/");
  const uploadIndex = urlParts.findIndex((part) => part === "upload");
  
  if (uploadIndex === -1) return null;
  
  const afterUpload = urlParts.slice(uploadIndex + 1);
  let publicId = "";
  
  // Si el primer elemento después de upload es "v" seguido de números, lo saltamos
  if (afterUpload[0]?.startsWith("v") && /^\d+$/.test(afterUpload[0].substring(1))) {
    publicId = afterUpload.slice(1).join("/");
  } else {
    publicId = afterUpload.join("/");
  }
  
  // Remover la extensión del archivo
  publicId = publicId.replace(/\.[^/.]+$/, "");
  return publicId;
};

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const partners = await prisma.partner.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(partners);
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
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
    if (!data.name || !data.image) {
      return NextResponse.json(
        { error: "Name and image are required" },
        { status: 400 }
      );
    }

    const partner = await prisma.partner.create({
      data: {
        name: data.name,
        image: data.image,
        url: data.url || null,
        description: data.description || null,
      },
    });

    return NextResponse.json(partner);
  } catch (error: any) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create partner" },
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
    if (!data.name || !data.image) {
      return NextResponse.json(
        { error: "Name and image are required" },
        { status: 400 }
      );
    }

    // Obtener el partner actual para comparar la imagen
    const currentPartner = await prisma.partner.findUnique({
      where: { id: data.id },
    });

    if (!currentPartner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    // PRIMERO: Actualizar la base de datos con la nueva imagen
    const partner = await prisma.partner.update({
      where: { id: data.id },
      data: {
        name: data.name,
        image: data.image,
        url: data.url || null,
        description: data.description || null,
      },
    });

    // DESPUÉS: Eliminar la imagen anterior de Cloudinary (solo si es diferente y existe)
    const originalImage = data.originalImage || currentPartner.image;
    const newImage = data.image;

    if (
      originalImage &&
      newImage &&
      originalImage !== newImage &&
      originalImage.includes("res.cloudinary.com")
    ) {
      try {
        const originalPublicId = extractPublicId(originalImage);
        const newPublicId = extractPublicId(newImage);
        
        // Solo eliminar si el public_id es diferente (para evitar eliminar la nueva imagen)
        if (originalPublicId && originalPublicId !== newPublicId) {
          await new Promise<void>((resolve) => {
            cloudinary.uploader.destroy(originalPublicId, (error) => {
              if (error) {
                console.error("Error deleting old image from Cloudinary:", error);
              } else {
                console.log("Old image deleted successfully:", originalPublicId);
              }
              resolve();
            });
          });
        }
      } catch (cloudinaryError) {
        console.error("Error deleting old image from Cloudinary:", cloudinaryError);
      }
    }

    return NextResponse.json(partner);
  } catch (error: any) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update partner" },
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

    // Obtener el partner antes de eliminarlo para tener la URL de la imagen
    const partner = await prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }

    // Eliminar la imagen de Cloudinary primero
    let imageDeleted = true;
    if (partner.image && partner.image.includes("res.cloudinary.com")) {
      try {
        const publicId = extractPublicId(partner.image);
        if (publicId) {
          await new Promise<void>((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error) => {
              if (error) {
                console.error("Error deleting image from Cloudinary:", error);
                reject(error);
              } else {
                console.log("Image deleted from Cloudinary:", publicId);
                resolve();
              }
            });
          });
        }
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary (catch block):", cloudinaryError);
        imageDeleted = false;
      }
    }

    // Solo eliminar el registro si la imagen se eliminó correctamente (o no había imagen)
    if (!imageDeleted && partner.image) {
      return NextResponse.json(
        { error: "Failed to delete image from Cloudinary" },
        { status: 500 }
      );
    }

    // Eliminar el registro de la base de datos
    await prisma.partner.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete partner" },
      { status: 500 }
    );
  }
}


