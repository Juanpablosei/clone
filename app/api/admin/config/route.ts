import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const config = await prisma.siteConfig.upsert({
      where: { id: "site-config" },
      update: {
        logo: data.logo || null,
        email: data.email || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
      },
      create: {
        id: "site-config",
        logo: data.logo || null,
        email: data.email || null,
        linkedin: data.linkedin || null,
        twitter: data.twitter || null,
      },
    });

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error updating config:", error);
    return NextResponse.json(
      { error: "Failed to update configuration" },
      { status: 500 }
    );
  }
}

