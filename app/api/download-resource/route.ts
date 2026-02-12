import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fileUrl = searchParams.get("url");
  const filename = searchParams.get("filename");

  if (!fileUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Solo aceptar rutas relativas locales (/resources/...)
  if (!fileUrl.startsWith("/resources/")) {
    return NextResponse.json(
      { error: "Only local files from /resources/ are supported" },
      { status: 400 }
    );
  }

  // Extraer el nombre del archivo de la URL
  const fileName = fileUrl.split("/").pop() || filename || "resource";
  
  // Construir la ruta del archivo
  const filePath = join(process.cwd(), "public", "resources", fileName);

  // Validar que el archivo existe
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  try {
    // Leer el archivo
    const fileBuffer = await readFile(filePath);

    // Determinar el Content-Type basado en la extensión
    const extension = fileName.split(".").pop()?.toLowerCase() || "";
    const contentTypeMap: Record<string, string> = {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ppt: "application/vnd.ms-powerpoint",
      pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    };

    const contentType = contentTypeMap[extension] || "application/octet-stream";

    // Crear headers para forzar descarga
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set(
      "Content-Disposition",
      `attachment; filename="${fileName.replace(/"/g, "")}"`
    );
    headers.set("Content-Length", fileBuffer.length.toString());
    headers.set("Cache-Control", "private, max-age=0, no-store");

    return new NextResponse(fileBuffer, { status: 200, headers });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error reading file:", errorMessage);
    return NextResponse.json(
      { error: "Failed to read file", detail: errorMessage },
      { status: 500 }
    );
  }
}
