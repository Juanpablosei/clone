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

function extractPublicId(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  
  const urlParts = url.split("/");
  const uploadIndex = urlParts.findIndex((part) => part === "upload");
  
  if (uploadIndex === -1) return null;
  
  const afterUpload = urlParts.slice(uploadIndex + 1);
  let publicId = "";
  
  if (afterUpload[0]?.startsWith("v") && /^\d+$/.test(afterUpload[0].substring(1))) {
    publicId = afterUpload.slice(1).join("/");
  } else {
    publicId = afterUpload.join("/");
  }
  
  return publicId.replace(/\.[^/.]+$/, "");
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
    const team = await prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error("Error fetching team:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
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
    if (!data.name || !data.role || !data.image) {
      return NextResponse.json(
        { error: "Name, role, and image are required" },
        { status: 400 }
      );
    }

    // Generar slug si no se proporciona
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    // Verificar si el slug ya existe
    const existing = await prisma.teamMember.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A team member with this slug already exists" },
        { status: 400 }
      );
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        name: data.name,
        role: data.role,
        type: data.type || "OUR_TEAM",
        image: data.image,
        description: data.description || null,
        slug,
        linkedin: data.linkedin || null,
        x: data.x || null,
        url: data.url || null,
      },
    });

    return NextResponse.json(teamMember);
  } catch (error: any) {
    console.error("Error creating team member:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create team member" },
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
    if (!data.name || !data.role) {
      return NextResponse.json(
        { error: "Name and role are required" },
        { status: 400 }
      );
    }

    // Obtener el miembro actual para comparar la imagen
    const currentMember = await prisma.teamMember.findUnique({
      where: { id: data.id },
    });

    if (!currentMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    // Validar que haya una imagen (nueva o existente)
    if (!data.image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    // Generar slug si no se proporciona (debe estar antes de usarlo)
    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    // Verificar si el slug ya existe (excluyendo el miembro actual)
    const existing = await prisma.teamMember.findUnique({
      where: { slug },
    });

    if (existing && existing.id !== data.id) {
      return NextResponse.json(
        { error: "A team member with this slug already exists" },
        { status: 400 }
      );
    }

    const originalImage = data.originalImage || currentMember.image;
    const newImage = data.image;

    console.log("🔄 Updating team member:", {
      id: data.id,
      originalImage,
      newImage,
      imagesMatch: originalImage === newImage,
    });

    // PRIMERO: Actualizar la base de datos con la nueva imagen
    // Esto asegura que si algo falla después, al menos tenemos la nueva imagen guardada
    const teamMember = await prisma.teamMember.update({
      where: { id: data.id },
      data: {
        name: data.name,
        role: data.role,
        type: data.type || "OUR_TEAM",
        image: newImage,
        description: data.description || null,
        slug,
        linkedin: data.linkedin || null,
        x: data.x || null,
        url: data.url || null,
      },
    });

    console.log("✅ Team member updated in database:", {
      id: teamMember.id,
      image: teamMember.image,
    });

    // DESPUÉS: Eliminar la imagen anterior de Cloudinary (solo si es diferente y NO está en uso en Base 1)
    // Hacemos esto después de guardar para asegurar que la nueva imagen ya está guardada
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
            await new Promise((resolve, reject) => {
              cloudinary.uploader.destroy(originalPublicId, (error, result) => {
                if (error) {
                  console.error("Error deleting old image from Cloudinary:", error);
                  // No fallar si no se puede eliminar la imagen anterior
                  resolve(result);
                } else {
                  console.log("🧹 Old image deleted successfully:", originalPublicId);
                  resolve(result);
                }
              });
            });
          }
        } else {
          console.log("⚠️ Skipping deletion - same public_id or invalid:", {
            originalPublicId,
            newPublicId,
          });
        }
      } catch (cloudinaryError) {
        console.error("Error deleting old image from Cloudinary:", cloudinaryError);
        // No fallar si no se puede eliminar la imagen anterior
      }
    }

    return NextResponse.json(teamMember);
  } catch (error: any) {
    console.error("Error updating team member:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update team member" },
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

    // Obtener el miembro antes de eliminarlo para tener la URL de la imagen
    const teamMember = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!teamMember) {
      return NextResponse.json({ error: "Team member not found" }, { status: 404 });
    }

    // Eliminar la imagen de Cloudinary solo si NO está siendo usada en Base 1
    let imageDeleted = true;
    if (teamMember.image && teamMember.image.includes("res.cloudinary.com")) {
      try {
        // Verificar si la imagen está siendo usada en Base 1 (main database)
        const usedInMain = await isUrlUsedInMainDb(teamMember.image);
        if (usedInMain) {
          console.log("ℹ️ Image is still used in main DB, skipping delete:", teamMember.image);
          imageDeleted = true; // No es un error, simplemente no se borra
        } else {
          const publicId = extractPublicId(teamMember.image);
          if (publicId) {
            await new Promise((resolve, reject) => {
              cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                  console.error("Error deleting image from Cloudinary:", error);
                  reject(error);
                } else {
                  console.log("🧹 Image deleted from Cloudinary:", publicId);
                  resolve(result);
                }
              });
            });
          }
        }
      } catch (cloudinaryError) {
        console.error("Error deleting image from Cloudinary:", cloudinaryError);
        imageDeleted = false;
      }
    }

    // Solo eliminar el registro si la imagen se eliminó correctamente (o no había imagen, o está en uso en Base 1)
    if (!imageDeleted && teamMember.image) {
      return NextResponse.json(
        { error: "Failed to delete image from Cloudinary" },
        { status: 500 }
      );
    }

    // Eliminar el registro de la base de datos
    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting team member:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete team member" },
      { status: 500 }
    );
  }
}
