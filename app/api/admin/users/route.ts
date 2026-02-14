import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import type { UserRole } from "../../../../generated/prisma/client";
import bcrypt from "bcryptjs";

export async function GET() {
  const session = await auth();

  console.log("Users API - Session:", session ? { id: session.user?.id, email: session.user?.email, role: session.user?.role } : "No session");

  if (!session) {
    console.log("Users API - No session found");
    return NextResponse.json({ error: "No tienes permiso para ver usuarios." }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    console.log("Users API - User role is not ADMIN:", session.user.role);
    return NextResponse.json({ error: "No tienes permiso para ver usuarios." }, { status: 401 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    // Validar campos requeridos
    if (!data.email || !data.password || !data.role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    // Validar que el rol sea válido
    if (!["ADMIN", "EDITOR", "VIEWER"].includes(data.role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN, EDITOR, or VIEWER" },
        { status: 400 }
      );
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || null,
        role: data.role,
        active: data.active !== false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error creating user:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // Validar que el rol sea válido si se proporciona
    if (data.role && !["ADMIN", "EDITOR", "VIEWER"].includes(data.role)) {
      return NextResponse.json(
        { error: "Invalid role. Must be ADMIN, EDITOR, or VIEWER" },
        { status: 400 }
      );
    }

    // Preparar datos de actualización (role es enum UserRole en Prisma)
    const updateData: { email?: string; name?: string | null; role?: UserRole; active?: boolean; password?: string } = {};
    if (data.email) updateData.email = data.email;
    if (data.name !== undefined) updateData.name = data.name || null;
    if (data.role) updateData.role = data.role as UserRole;
    if (data.active !== undefined) updateData.active = Boolean(data.active);
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: data.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    // No permitir eliminar tu propio usuario
    if (id === session.user.id) {
      return NextResponse.json(
        { error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
