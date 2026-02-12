import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import { generateSlug } from "../../../../lib/utils";

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

  if (afterUpload[0]?.startsWith("v") && /^\d+$/.test(afterUpload[0].substring(1))) {
    publicId = afterUpload.slice(1).join("/");
  } else {
    publicId = afterUpload.join("/");
  }

  publicId = publicId.replace(/\.[^/.]+$/, "");
  return publicId;
};

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const news = await prisma.news.findMany({
      include: {
        author: true,
        blocks: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
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
    if (!data.title || !data.type) {
      return NextResponse.json(
        { error: "Title and type are required" },
        { status: 400 }
      );
    }

    // Validar que haya al menos un bloque
    if (!data.blocks || !Array.isArray(data.blocks) || data.blocks.length === 0) {
      return NextResponse.json(
        { error: "At least one block is required" },
        { status: 400 }
      );
    }

    // Generar URL slug si no se proporciona
    const urlSlug = data.url || generateSlug(data.title);

    // Verificar si la URL ya existe
    const existing = await prisma.news.findUnique({
      where: { url: urlSlug },
    });

    if (existing) {
      return NextResponse.json({ error: "A news article with this URL already exists" }, { status: 400 });
    }

    // Crear la noticia con bloques
    const news = await prisma.news.create({
      data: {
        title: data.title,
        date: data.date ? new Date(data.date) : new Date(),
        type: data.type,
        url: urlSlug,
        authorId: data.authorId || null,
        // Campos legacy (opcionales, para compatibilidad)
        image: data.image || null,
        images: data.images || [],
        summary: data.summary || null,
        content: data.content || null,
        blocks: {
          create: data.blocks.map((block: any, index: number) => ({
            type: block.type,
            order: block.order !== undefined ? block.order : index + 1,
            content: block.content || null,
            imageUrl: block.imageUrl || null,
            images: block.images || [],
            metadata: block.metadata || null,
          })),
        },
      },
      include: {
        author: true,
        blocks: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(news);
  } catch (error: any) {
    console.error("Error creating news:", error);
    return NextResponse.json({ error: error.message || "Failed to create news" }, { status: 500 });
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
    if (!data.title || !data.type) {
      return NextResponse.json(
        { error: "Title and type are required" },
        { status: 400 }
      );
    }

    // Validar que haya al menos un bloque
    if (!data.blocks || !Array.isArray(data.blocks) || data.blocks.length === 0) {
      return NextResponse.json(
        { error: "At least one block is required" },
        { status: 400 }
      );
    }

    // Obtener la noticia actual con bloques
    const currentNews = await prisma.news.findUnique({
      where: { id: data.id },
      include: { blocks: true },
    });

    if (!currentNews) {
      return NextResponse.json({ error: "News article not found" }, { status: 404 });
    }

    // Eliminar imágenes de Cloudinary de bloques que se van a eliminar
    const incomingBlockIds = data.blocks
      .map((b: any) => b.id)
      .filter((id: string) => id !== undefined);
    const blocksToDelete = currentNews.blocks.filter(
      (block) => !incomingBlockIds.includes(block.id)
    );

    for (const block of blocksToDelete) {
      // Eliminar imágenes de Cloudinary si existen
      if (block.imageUrl && block.imageUrl.includes("res.cloudinary.com")) {
        try {
          const publicId = extractPublicId(block.imageUrl);
          if (publicId) {
            await new Promise((resolve) => {
              cloudinary.uploader.destroy(publicId, (error) => {
                if (error) {
                  console.error("Error deleting block image from Cloudinary:", error);
                }
                resolve(null);
              });
            });
          }
        } catch (error) {
          console.error("Error deleting block image:", error);
        }
      }

      // Eliminar imágenes de galería
      if (block.images && block.images.length > 0) {
        for (const imageUrl of block.images) {
          if (imageUrl.includes("res.cloudinary.com")) {
            try {
              const publicId = extractPublicId(imageUrl);
              if (publicId) {
                await new Promise((resolve) => {
                  cloudinary.uploader.destroy(publicId, (error) => {
                    if (error) {
                      console.error("Error deleting gallery image from Cloudinary:", error);
                    }
                    resolve(null);
                  });
                });
              }
            } catch (error) {
              console.error("Error deleting gallery image:", error);
            }
          }
        }
      }
    }

    // Generar URL slug si no se proporciona
    const urlSlug = data.url || generateSlug(data.title);

    // Verificar si la URL ya existe (excluyendo la noticia actual)
    const existing = await prisma.news.findUnique({
      where: { url: urlSlug },
    });

    if (existing && existing.id !== data.id) {
      return NextResponse.json({ error: "A news article with this URL already exists" }, { status: 400 });
    }

    // Actualizar la noticia
    const news = await prisma.news.update({
      where: { id: data.id },
      data: {
        title: data.title,
        date: data.date ? new Date(data.date) : currentNews.date,
        type: data.type,
        url: urlSlug,
        authorId: data.authorId || null,
        // Campos legacy (opcionales, para compatibilidad)
        image: data.image || null,
        images: data.images || [],
        summary: data.summary || null,
        content: data.content || null,
      },
    });

    // Eliminar bloques que ya no están en el array
    if (incomingBlockIds.length > 0) {
      await prisma.newsBlock.deleteMany({
        where: {
          newsId: data.id,
          id: {
            notIn: incomingBlockIds,
          },
        },
      });
    } else {
      // Si no hay bloques nuevos, eliminar todos
      await prisma.newsBlock.deleteMany({
        where: { newsId: data.id },
      });
    }

    // Crear o actualizar bloques
    for (let index = 0; index < data.blocks.length; index++) {
      const block = data.blocks[index];
      const blockData = {
        type: block.type,
        order: block.order !== undefined ? block.order : index + 1,
        content: block.content || null,
        imageUrl: block.imageUrl || null,
        images: block.images || [],
        metadata: block.metadata || null,
      };

      if (block.id && incomingBlockIds.includes(block.id)) {
        // Actualizar bloque existente
        await prisma.newsBlock.update({
          where: { id: block.id },
          data: blockData,
        });
      } else {
        // Crear nuevo bloque
        await prisma.newsBlock.create({
          data: {
            ...blockData,
            newsId: data.id,
          },
        });
      }
    }

    // Obtener la noticia actualizada con bloques
    const updatedNews = await prisma.news.findUnique({
      where: { id: data.id },
      include: {
        author: true,
        blocks: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(updatedNews);
  } catch (error: any) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: error.message || "Failed to update news" }, { status: 500 });
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

    // Obtener la noticia antes de eliminarla
    const news = await prisma.news.findUnique({
      where: { id },
    });

    if (!news) {
      return NextResponse.json({ error: "News article not found" }, { status: 404 });
    }

    // Eliminar la imagen principal de Cloudinary
    let imageDeleted = true;
    if (news.image && news.image.includes("res.cloudinary.com")) {
      try {
        const publicId = extractPublicId(news.image);
        if (publicId) {
          await new Promise<void>((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
              if (error) {
                console.error("Error deleting image from Cloudinary:", error);
                reject(error);
              } else {
                console.log("Image deleted from Cloudinary:", result);
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

    // Eliminar imágenes adicionales de Cloudinary
    if (news.images && news.images.length > 0) {
      for (const imageUrl of news.images) {
        if (imageUrl.includes("res.cloudinary.com")) {
          try {
            const publicId = extractPublicId(imageUrl);
            if (publicId) {
              await new Promise<void>((resolve) => {
                cloudinary.uploader.destroy(publicId, (error) => {
                  if (error) {
                    console.error("Error deleting additional image from Cloudinary:", error);
                  } else {
                    console.log("Additional image deleted from Cloudinary:", publicId);
                  }
                  resolve();
                });
              });
            }
          } catch (cloudinaryError) {
            console.error("Error deleting additional image:", cloudinaryError);
          }
        }
      }
    }

    // Solo eliminar el registro si la imagen principal se eliminó correctamente (o no había imagen)
    if (!imageDeleted && news.image) {
      return NextResponse.json({ error: "Failed to delete image from Cloudinary" }, { status: 500 });
    }

    // Eliminar el registro de la base de datos
    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: error.message || "Failed to delete news" }, { status: 500 });
  }
}

