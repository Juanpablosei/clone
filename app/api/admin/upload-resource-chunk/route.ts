import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const CHUNK_SIZE = 1024 * 1024; // 1MB por chunk
const RESOURCES_DIR = join(process.cwd(), "public", "resources");

// Almacenar chunks temporalmente en memoria (en producción usar Redis o similar)
const chunkStore = new Map<
  string,
  {
    chunks: Buffer[];
    totalSize: number;
    fileName: string;
    mimeType: string;
    createdAt: number;
  }
>();

// Limpiar chunks antiguos cada 10 minutos (timeout de 30 minutos)
setInterval(() => {
  const now = Date.now();
  const TIMEOUT = 30 * 60 * 1000; // 30 minutos
  for (const [uploadId, store] of chunkStore.entries()) {
    if (now - store.createdAt > TIMEOUT) {
      chunkStore.delete(uploadId);
      console.log(`Cleaned up expired upload: ${uploadId}`);
    }
  }
}, 10 * 60 * 1000); // Cada 10 minutos

export async function POST(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const chunk = formData.get("chunk") as File;
    const chunkIndex = parseInt(formData.get("chunkIndex") as string);
    const totalChunks = parseInt(formData.get("totalChunks") as string);
    const uploadId = formData.get("uploadId") as string;
    const fileName = formData.get("fileName") as string;
    const mimeType = formData.get("mimeType") as string;
    const fileSize = parseInt(formData.get("fileSize") as string);

    if (!chunk || chunkIndex === undefined || totalChunks === undefined || !uploadId || !fileName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validar tamaño total del archivo
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Convertir chunk a Buffer
    const chunkBuffer = Buffer.from(await chunk.arrayBuffer());

    // Inicializar o actualizar el almacenamiento de chunks
    if (!chunkStore.has(uploadId)) {
      chunkStore.set(uploadId, {
        chunks: new Array(totalChunks),
        totalSize: fileSize,
        fileName,
        mimeType: mimeType || "application/octet-stream",
        createdAt: Date.now(),
      });
    }

    const store = chunkStore.get(uploadId)!;
    store.chunks[chunkIndex] = chunkBuffer;

    // Verificar si todos los chunks han llegado
    const allChunksReceived = store.chunks.every((c) => c !== undefined);

    if (allChunksReceived) {
      // Reconstruir el archivo completo
      const fullBuffer = Buffer.concat(store.chunks);

      // Validar tamaño final
      if (fullBuffer.length !== store.totalSize) {
        chunkStore.delete(uploadId);
        return NextResponse.json({ error: "File size mismatch" }, { status: 400 });
      }

      // Generar nombre de archivo único
      const timestamp = Date.now();
      const sanitizedFileName = fileName
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .substring(0, 100);
      const fileExtension = fileName.split(".").pop() || "";
      const uniqueFileName = `${sanitizedFileName.replace(/\.[^/.]+$/, "")}-${timestamp}.${fileExtension}`;

      // Asegurar que el directorio existe
      if (!existsSync(RESOURCES_DIR)) {
        await mkdir(RESOURCES_DIR, { recursive: true });
      }

      // Guardar el archivo
      const filePath = join(RESOURCES_DIR, uniqueFileName);
      await writeFile(filePath, fullBuffer);

      // Limpiar el almacenamiento de chunks
      chunkStore.delete(uploadId);

      // Retornar la ruta relativa para usar en la base de datos
      const relativePath = `/resources/${uniqueFileName}`;

      return NextResponse.json({
        success: true,
        path: relativePath,
        fileName: uniqueFileName,
      });
    }

    // Si aún faltan chunks, retornar progreso
    const receivedChunks = store.chunks.filter((c) => c !== undefined).length;
    return NextResponse.json({
      success: true,
      progress: (receivedChunks / totalChunks) * 100,
      receivedChunks,
      totalChunks,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error uploading resource chunk:", error);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
