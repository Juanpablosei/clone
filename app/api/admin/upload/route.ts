import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
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

function detectCloudinaryResourceType(mimetype: string, originalName = ""): "raw" | "image" | "video" {
  const ext = (originalName.split(".").pop() || "").toLowerCase();

  if (
    mimetype === "application/pdf" ||
    mimetype.includes("officedocument") ||
    mimetype.includes("msword") ||
    mimetype.includes("excel") ||
    mimetype.includes("powerpoint") ||
    ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip", "rar"].includes(ext)
  ) {
    return "raw";
  }

  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";

  return "raw";
}

function extractPublicId(url: string): string | null {
  if (!url || !url.includes("res.cloudinary.com")) return null;
  const urlParts = url.split("/");
  const uploadIndex = urlParts.findIndex((part) => part === "upload");
  if (uploadIndex === -1) return null;
  const afterUpload = urlParts.slice(uploadIndex + 1);
  const publicIdWithVersion =
    afterUpload[0]?.startsWith("v") && /^\d+$/.test(afterUpload[0].substring(1))
      ? afterUpload.slice(1).join("/")
      : afterUpload.join("/");
  return publicIdWithVersion.replace(/\.[^/.]+$/, "");
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

export async function POST(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "team"; // Default: team
    const slug = formData.get("slug") as string;
    const previousUrl = (formData.get("previousUrl") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validar tipo de archivo (imágenes o documentos)
    const isImage = file.type.startsWith("image/");
    const isDocument = 
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/vnd.ms-excel" ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    
    if (!isImage && !isDocument) {
      return NextResponse.json({ error: "File must be an image or document (PDF, Word, Excel)" }, { status: 400 });
    }

    // Validar tamaño (20MB para documentos, 10MB para imágenes)
    const maxSize = isDocument ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `File size must be less than ${isDocument ? '20MB' : '10MB'}` 
      }, { status: 400 });
    }

    // Validar folder
    const validFolders = ["team", "news", "partners", "worked", "config", "authors", "about-us", "home", "resources"];
    if (!validFolders.includes(folder)) {
      return NextResponse.json({ error: `Invalid folder. Allowed folders: ${validFolders.join(", ")}` }, { status: 400 });
    }

    // Convertir File a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generar un public_id único y más corto para evitar conflictos
    // Para documentos PDF, priorizar el nombre del archivo sobre el slug
    // IMPORTANTE: Para documentos raw en Cloudinary, el public_id debe incluir la extensión
    let baseName = "";
    let fileExtension = "";
    
    if (file.name) {
      // Extraer la extensión del archivo
      const extensionMatch = file.name.match(/\.([^.]+)$/);
      if (extensionMatch) {
        fileExtension = extensionMatch[1].toLowerCase();
      }
    }
    
    if (isDocument && file.name) {
      // Para documentos, usar el nombre del archivo sin extensión
      const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
      // Limpiar y limitar a 50 caracteres
      baseName = fileNameWithoutExt
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .substring(0, 50)
        .replace(/^-+|-+$/g, ""); // Eliminar guiones iniciales y finales
    } else if (slug) {
      // Para imágenes, usar el slug pero limitarlo a 50 caracteres
      baseName = slug
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .substring(0, 50)
        .replace(/^-+|-+$/g, "");
    } else {
      baseName = folder;
    }

    // Si baseName está vacío después de limpiar, usar un valor por defecto
    if (!baseName) {
      baseName = isDocument ? "document" : "file";
    }

    // Generar public_id con timestamp para evitar conflictos
    const timestamp = Date.now();
    // Para documentos, incluir la extensión en el public_id para que Cloudinary reconozca el formato
    const uniquePublicId = isDocument && fileExtension 
      ? `${baseName}-${timestamp}.${fileExtension}`
      : `${baseName}-${timestamp}`;

    console.log("📤 Uploading to Cloudinary:", {
      folder: `gradient/${folder}`,
      public_id: uniquePublicId,
      resource_type: isDocument ? "raw" : "auto",
    });

    // Determinar resource_type explícito para evitar falsos positivos con "auto".
    const resourceType = detectCloudinaryResourceType(file.type, file.name);

    // Subir a Cloudinary usando stream binario.
    // Esto evita archivos corruptos en documentos (PDF/Word/Excel) con resource_type=raw.
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `gradient/${folder}`,
          public_id: uniquePublicId,
          overwrite: false, // No sobrescribir para evitar eliminar archivos existentes
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    interface CloudinaryResult {
      secure_url: string;
      public_id: string;
      [key: string]: unknown;
    }

    const result = uploadResult as CloudinaryResult;

    // Verificar que la subida fue exitosa
    if (!result || !result.secure_url) {
      return NextResponse.json(
        { error: "Failed to upload image to Cloudinary" },
        { status: 500 }
      );
    }

    // Retornar la URL de Cloudinary
    console.log("✅ File uploaded to Cloudinary:", result.secure_url);

    // Limpieza de imagen anterior:
    // - Si la URL anterior existe y cambió, intentamos borrarla.
    // - Pero SI está siendo usada por Base 1, NO se borra.
    if (previousUrl && previousUrl !== result.secure_url) {
      const usedInMain = await isUrlUsedInMainDb(previousUrl);
      if (usedInMain) {
        console.log("ℹ️ Previous image is still used in main DB, skipping delete:", previousUrl);
      } else {
        const publicId = extractPublicId(previousUrl);
        if (publicId) {
          try {
            const destroyResult = await cloudinary.uploader.destroy(publicId, {
              resource_type: "image",
            });
            console.log("🧹 Previous image removed:", publicId, destroyResult.result);
          } catch (destroyError) {
            console.error("⚠️ Failed to remove previous image:", destroyError);
          }
        }
      }
    }

    return NextResponse.json({ path: result.secure_url });
  } catch (error: unknown) {
    console.error("Error uploading file:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

