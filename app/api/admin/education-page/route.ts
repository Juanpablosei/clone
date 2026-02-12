import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let educationPage = await prisma.educationPage.findUnique({
      where: { id: "education-page" },
    });

    // Si no existe, crear uno con valores por defecto
    if (!educationPage) {
      educationPage = await prisma.educationPage.create({
        data: {
          id: "education-page",
          introBadge: "OUR APPROACH",
          introTitle: "Interactive Learning Approach",
          introDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          accordionItems: [
            { title: "Fee Only Financial Planning", content: "Lorem ipsum dolor sit amet." },
            { title: "Fiduciary Financial Planning", content: "Lorem ipsum dolor sit amet." },
            { title: "Professionals Only, No Salespeople", content: "Lorem ipsum dolor sit amet." },
          ],
          features: [
            "College planning",
            "Income optimization",
            "Current cash flow needs",
            "Customized asset allocation",
            "Necessary insurance protection",
          ],
          contentImage: "/Professional_Discussion.png",
          contentImageAlt: "Professional working",
          contentBadge: "PREPARING FOR YOUR FUTURE",
          contentTitle: "Achieving Your Vision",
          contentDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          iconType: "chart",
        },
      });
    }

    return NextResponse.json(educationPage);
  } catch (error: unknown) {
    console.error("Error fetching education page:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch education page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    const educationPage = await prisma.educationPage.upsert({
      where: { id: "education-page" },
      update: {
        introBadge: data.introBadge || null,
        introTitle: data.introTitle || null,
        introDescription: data.introDescription || null,
        accordionItems: data.accordionItems || null,
        features: data.features || null,
        contentImage: data.contentImage || null,
        contentImageAlt: data.contentImageAlt || null,
        contentBadge: data.contentBadge || null,
        contentTitle: data.contentTitle || null,
        contentDescription: data.contentDescription || null,
        iconType: data.iconType || null,
      },
      create: {
        id: "education-page",
        introBadge: data.introBadge || null,
        introTitle: data.introTitle || null,
        introDescription: data.introDescription || null,
        accordionItems: data.accordionItems || null,
        features: data.features || null,
        contentImage: data.contentImage || null,
        contentImageAlt: data.contentImageAlt || null,
        contentBadge: data.contentBadge || null,
        contentTitle: data.contentTitle || null,
        contentDescription: data.contentDescription || null,
        iconType: data.iconType || null,
      },
    });

    return NextResponse.json(educationPage);
  } catch (error: unknown) {
    console.error("Error updating education page:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update education page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
