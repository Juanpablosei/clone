import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import pg from "pg";

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const CONTENT_TABLES = [
  "authors",
  "news",
  "news_blocks",
  "partners",
  "worked",
  "team_members",
  "site_config",
  "resource_downloads",
  "resources",
  "home_page",
  "about_us_page",
  "about_us_testimonials",
  "education_page",
  "research_publications_page",
  "advisory_page",
] as const;

// Función helper para extraer public_id de URL de Cloudinary
function extractPublicId(url: string): string | null {
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
}

async function isUrlUsedInMainDb(url: string): Promise<boolean> {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString || !url) return false;

  const client = new pg.Client({ connectionString });
  const needle = `%${url}%`;

  try {
    await client.connect();
    for (const table of CONTENT_TABLES) {
      try {
        const res = await client.query(
          `SELECT 1
           FROM "${table}" t
           WHERE to_jsonb(t)::text LIKE $1
           LIMIT 1`,
          [needle]
        );
        if (res.rows.length > 0) return true;
      } catch (tableError) {
        // Si una tabla no existe en main o falla por estructura, la ignoramos.
        // No debe bloquear la limpieza de imágenes.
        console.warn(`Skipping table "${table}" while checking main DB usage:`, tableError);
        continue;
      }
    }
    return false;
  } catch (error) {
    console.error("Error checking URL usage in main DB:", error);
    // En fallo total de conexión/consulta global, mantener comportamiento seguro.
    return true;
  } finally {
    await client.end();
  }
}

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const worked = await prisma.worked.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(worked);
  } catch (error) {
    console.error("Error fetching worked:", error);
    return NextResponse.json(
      { error: "Failed to fetch worked" },
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

    const worked = await prisma.worked.create({
      data: {
        name: data.name,
        image: data.image,
        url: data.url || null,
        description: data.description || null,
      },
    });

    return NextResponse.json(worked);
  } catch (error: any) {
    console.error("Error creating worked:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create worked" },
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

    // Obtener el worked actual para comparar la imagen
    const currentWorked = await prisma.worked.findUnique({
      where: { id: data.id },
    });

    if (!currentWorked) {
      return NextResponse.json({ error: "Worked not found" }, { status: 404 });
    }

    // PRIMERO: Actualizar la base de datos con la nueva imagen
    const worked = await prisma.worked.update({
      where: { id: data.id },
      data: {
        name: data.name,
        image: data.image,
        url: data.url || null,
        description: data.description || null,
      },
    });

    // DESPUÉS: Eliminar la imagen anterior de Cloudinary (solo si es diferente y NO está en uso en Base 1)
    const originalImage = data.originalImage || currentWorked.image;
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
          // Verificar si la imagen anterior está siendo usada en Base 1 (main database)
          const usedInMain = await isUrlUsedInMainDb(originalImage);
          if (usedInMain) {
            console.log("ℹ️ Previous image is still used in main DB, skipping delete:", originalImage);
          } else {
            await new Promise<void>((resolve) => {
              cloudinary.uploader.destroy(originalPublicId, (error) => {
                if (error) {
                  console.error("Error deleting old image from Cloudinary:", error);
                } else {
                  console.log("🧹 Old image deleted successfully:", originalPublicId);
                }
                resolve();
              });
            });
          }
        }
      } catch (cloudinaryError) {
        console.error("Error deleting old image from Cloudinary:", cloudinaryError);
      }
    }

    return NextResponse.json(worked);
  } catch (error: any) {
    console.error("Error updating worked:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update worked" },
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

    // Obtener el worked antes de eliminarlo para tener la URL de la imagen
    const worked = await prisma.worked.findUnique({
      where: { id },
    });

    if (!worked) {
      return NextResponse.json({ error: "Worked not found" }, { status: 404 });
    }

    // Eliminar la imagen de Cloudinary solo si NO está siendo usada en Base 1
    let imageDeleted = true;
    if (worked.image && worked.image.includes("res.cloudinary.com")) {
      try {
        // Verificar si la imagen está siendo usada en Base 1 (main database)
        const usedInMain = await isUrlUsedInMainDb(worked.image);
        if (usedInMain) {
          console.log("ℹ️ Image is still used in main DB, skipping delete:", worked.image);
          imageDeleted = true; // No es un error, simplemente no se borra
        } else {
          const publicId = extractPublicId(worked.image);
          if (publicId) {
            await new Promise<void>((resolve, reject) => {
              cloudinary.uploader.destroy(publicId, (error) => {
                if (error) {
                  console.error("Error deleting image from Cloudinary:", error);
                  reject(error);
                } else {
                  console.log("🧹 Image deleted from Cloudinary:", publicId);
                  resolve();
                }
              });
            });
          }
        }
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary (catch block):", cloudinaryError);
        imageDeleted = false;
      }
    }

    // Solo eliminar el registro si la imagen se eliminó correctamente (o no había imagen, o está en uso en Base 1)
    if (!imageDeleted && worked.image) {
      return NextResponse.json(
        { error: "Failed to delete image from Cloudinary" },
        { status: 500 }
      );
    }

    // Eliminar el registro de la base de datos
    await prisma.worked.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting worked:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete worked" },
      { status: 500 }
    );
  }
}

