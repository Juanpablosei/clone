import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, resourceTitle } = body;

    if (!name || !email || !resourceTitle) {
      return NextResponse.json(
        { error: "Name, email, and resource title are required" },
        { status: 400 }
      );
    }

    // Guardar en la base de datos (permitir múltiples descargas del mismo email para diferentes recursos)
    const download = await prisma.resourceDownload.create({
      data: {
        name,
        email,
        resourceTitle,
      },
    });

    return NextResponse.json(
      { message: "Download registered successfully", download },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error saving resource download:", error);
    return NextResponse.json(
      { error: "Failed to save download" },
      { status: 500 }
    );
  }
}

