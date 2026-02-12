import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

// Use same shape as Prisma ResearchPublicationsPage (after generate)
type ResearchPublicationsPageDelegate = {
  findUnique: (args: { where: { id: string } }) => Promise<unknown>;
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  upsert: (args: {
    where: { id: string };
    update: Record<string, unknown>;
    create: Record<string, unknown>;
  }) => Promise<unknown>;
};

const DEFAULT_PAGE = {
  id: "research-publications-page",
  introBadge: "Research & Publications",
  introTitle: "Science-based clarity on AI progress, safety and societal impact",
  introDescription:
    "We conduct, distil and interpret rigorous research to help society understand how AI systems evolve, where they may fail, and what their societal and institutional impacts may be. Our publications include technical reports, policy submissions, commentary, and applied research created in partnership with government, industry and civil society.",
  accordionItems: [
    { title: "Technical reports", content: "In-depth analysis of AI capability, safety and sociotechnical impacts." },
    { title: "Policy submissions", content: "Evidence-based input to support policy and governance decisions." },
    { title: "Commentary and applied research", content: "Practical insight for government, industry and civil society." },
  ],
  features: [
    "Capability and safety research",
    "Sociotechnical impact analysis",
    "Policy and governance guidance",
    "Partnership-driven projects",
  ],
  contentImage: "/Conference.png",
  contentImageAlt: "Research and publications",
  contentBadge: "OUR WORK",
  contentTitle: "Rigorous research for real-world decisions",
  contentDescription:
    "We bring scientific clarity to high-stakes decisions about AI. Our work supports policymakers, organisations and the public to navigate uncertainty with evidence, not hype.",
  iconType: "chart",
};

function getDelegate() {
  return (prisma as unknown as { researchPublicationsPage: ResearchPublicationsPageDelegate }).researchPublicationsPage;
}

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const delegate = getDelegate();
    let page = await delegate.findUnique({ where: { id: "research-publications-page" } });

    if (!page) {
      page = await delegate.create({ data: DEFAULT_PAGE as Record<string, unknown> });
    }

    return NextResponse.json(page);
  } catch (error: unknown) {
    console.error("Error fetching research publications page:", error);
    const msg = error instanceof Error ? error.message : "Failed to fetch research publications page";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    const payload = {
      introBadge: data.introBadge ?? null,
      introTitle: data.introTitle ?? null,
      introDescription: data.introDescription ?? null,
      accordionItems: data.accordionItems ?? null,
      features: data.features ?? null,
      contentImage: data.contentImage ?? null,
      contentImageAlt: data.contentImageAlt ?? null,
      contentBadge: data.contentBadge ?? null,
      contentTitle: data.contentTitle ?? null,
      contentDescription: data.contentDescription ?? null,
      iconType: data.iconType ?? null,
    };

    const page = await getDelegate().upsert({
      where: { id: "research-publications-page" },
      update: payload,
      create: { id: "research-publications-page", ...payload },
    });

    return NextResponse.json(page);
  } catch (error: unknown) {
    console.error("Error updating research publications page:", error);
    const msg = error instanceof Error ? error.message : "Failed to update research publications page";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
