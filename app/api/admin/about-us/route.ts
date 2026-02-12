import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let aboutUsPage = await prisma.aboutUsPage.findUnique({
      where: { id: "about-us-page" },
    });

    // Si no existe, crear uno con valores por defecto
    if (!aboutUsPage) {
      aboutUsPage = await prisma.aboutUsPage.create({
        data: {
          id: "about-us-page",
          heroTitle: "About Us",
          heroSubtitle: "Cutting through the fog of AI uncertainty to help people see clearly and act with intention.",
          missionImage: "/Professional_Discussion.png",
          missionLabel: "Our Mission",
          missionTitle: "Safe and Responsible AI with Positive Public Impact",
          missionContent: "Gradient Institute is Australia's independent nonprofit research organisation helping society harness and steer AI with judgment. We bring science-based clarity to uncertainty so people can see clearly, decide confidently, and act with intention.",
          approachImage: "/Discussion.png",
          approachLabel: "Our Approach",
          approachTitle: "Science-Based Clarity in an Uncertain World",
          approachContent: "AI is reshaping society faster than most people can make sense of it. Between hype and fear, leaders, communities, and the public are often left making decisions in the fog—facing unclear risks, incomplete information, and misaligned expectations.\n\nWe cut through that fog with rigorous, independent research and practical guidance. Our approach combines deep technical understanding with sociotechnical insight, ensuring AI systems are designed, deployed, and governed in ways that genuinely serve society.",
          historyImage: "/Office.png",
          historyLabel: "Our History",
          historyTitle: "Building a Foundation for Responsible AI",
          historyContent: "Gradient Institute was founded to address a growing need: independent, science-based clarity on the rapidly evolving capabilities and impacts of AI. Since our inception, we have worked across research, policy, and practice to help government, industry, and civil society navigate AI's uncertainty with confidence.",
        },
      });
    }

    return NextResponse.json(aboutUsPage);
  } catch (error: unknown) {
    console.error("Error fetching about-us page:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch about-us page";
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

    // Validar campos requeridos
    if (!data.heroTitle || !data.heroSubtitle) {
      return NextResponse.json(
        { error: "Hero title and subtitle are required" },
        { status: 400 }
      );
    }

    const aboutUsPage = await prisma.aboutUsPage.upsert({
      where: { id: "about-us-page" },
      update: {
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        missionImage: data.missionImage || "",
        missionLabel: data.missionLabel || "",
        missionTitle: data.missionTitle || "",
        missionContent: data.missionContent || "",
        approachImage: data.approachImage || "",
        approachLabel: data.approachLabel || "",
        approachTitle: data.approachTitle || "",
        approachContent: data.approachContent || "",
        historyImage: data.historyImage || "",
        historyLabel: data.historyLabel || "",
        historyTitle: data.historyTitle || "",
        historyContent: data.historyContent || "",
      },
      create: {
        id: "about-us-page",
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        missionImage: data.missionImage || "",
        missionLabel: data.missionLabel || "",
        missionTitle: data.missionTitle || "",
        missionContent: data.missionContent || "",
        approachImage: data.approachImage || "",
        approachLabel: data.approachLabel || "",
        approachTitle: data.approachTitle || "",
        approachContent: data.approachContent || "",
        historyImage: data.historyImage || "",
        historyLabel: data.historyLabel || "",
        historyTitle: data.historyTitle || "",
        historyContent: data.historyContent || "",
      },
    });

    return NextResponse.json(aboutUsPage);
  } catch (error: unknown) {
    console.error("Error updating about-us page:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update about-us page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

