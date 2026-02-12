import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

type AdvisoryPageDelegate = {
  findUnique: (args: { where: { id: string } }) => Promise<unknown>;
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  upsert: (args: {
    where: { id: string };
    update: Record<string, unknown>;
    create: Record<string, unknown>;
  }) => Promise<unknown>;
};

const DEFAULT_PAGE = {
  id: "advisory-page",
  heroTitle: "Advisory & Guidance",
  introBadge: "Advisory & Guidance",
  introTitle: "Work with our AI experts",
  introDescription:
    "We bring scientific and policy insight into real decisions. Our advisory and guidance helps governments, organisations, and civil society understand trade-offs, clarify options, and move forward thoughtfully as AI reshapes their environment.",
  accordionItems: [
    { title: "Expert briefings", content: "Focused sessions with our researchers and practitioners on capability, safety, and sociotechnical impact." },
    { title: "Tailored consultations", content: "Ongoing support for strategy, governance, and responsible deployment aligned with your context." },
    { title: "Workshops and training", content: "Practical sessions to build judgment and capability within your organisation." },
  ],
  features: [
    "Policy and governance guidance",
    "Technical and safety assessment",
    "Stakeholder alignment",
    "Responsible deployment support",
  ],
  contentImage: "/Professional_Discussion.png",
  contentImageAlt: "Advisory and guidance",
  contentBadge: "HOW WE WORK",
  contentTitle: "Clarity when decisions matter",
  contentDescription:
    "We work with you to cut through hype and uncertainty, so choices are informed by evidence and judgment, not pressure or assumptions.",
  iconType: "chart",
  advisorySectionTitle: "Work with our AI experts",
  advisoryIntro1:
    "We bring scientific and policy insight into real decisions. Our advisory and guidance helps governments, organisations, and civil society understand trade-offs, clarify options, and move forward thoughtfully as AI reshapes their environment.",
  advisoryIntro2Before: "Please review our ",
  advisoryTermsLinkText: "Consultation Terms and Conditions",
  advisoryTermsLinkHref: "/terms",
  advisoryIntro2After: " before booking a briefing.",
  advisoryCard1Title: "1-hour expert call",
  advisoryCard1Description:
    "Focused sessions with our researchers and practitioners on capability, safety, and sociotechnical impact.",
  advisoryCard1ExampleQ:
    "Clarify specific risks, limits, or opportunities; discuss how our research applies to your context; explore governance or deployment options.",
  advisoryCard1Expert: "Direct access to Gradient researchers and practitioners.",
  advisoryCard1Format: "1-hour video call, with optional pre-read or follow-up note.",
  advisoryCard1CtaText: "Book a briefing",
  advisoryCard1CtaUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules",
  advisoryCard2Title: "Tailored consultations",
  advisoryCard2Description:
    "Ongoing support for strategy, governance, and responsible deployment aligned with your context.",
  advisoryCard2Ongoing: "Regular briefings and structured updates on capability, safety, and policy.",
  advisoryCard2DeepDive: "Focused projects on risk assessment, benchmarks, or governance design.",
  advisoryCard2Benchmarks: "Custom evaluation or benchmarking to support your decisions.",
  advisoryCard2CtaText: "Start a conversation",
  advisoryCard2CtaLink: "/contact-us",
};

function getDelegate() {
  return (prisma as unknown as { advisoryPage?: AdvisoryPageDelegate }).advisoryPage;
}

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const delegate = getDelegate();
    if (!delegate) {
      return NextResponse.json(DEFAULT_PAGE);
    }
    let page = await delegate.findUnique({ where: { id: "advisory-page" } });
    if (!page) {
      page = await delegate.create({ data: DEFAULT_PAGE as Record<string, unknown> });
    }
    return NextResponse.json(page);
  } catch {
    // Si falla (ej. columna heroTitle no existe), devolver defaults para que el admin cargue
    return NextResponse.json(DEFAULT_PAGE);
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
      heroTitle: data.heroTitle ?? null,
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
      advisorySectionTitle: data.advisorySectionTitle ?? null,
      advisoryIntro1: data.advisoryIntro1 ?? null,
      advisoryIntro2Before: data.advisoryIntro2Before ?? null,
      advisoryTermsLinkText: data.advisoryTermsLinkText ?? null,
      advisoryTermsLinkHref: data.advisoryTermsLinkHref ?? null,
      advisoryIntro2After: data.advisoryIntro2After ?? null,
      advisoryCard1Title: data.advisoryCard1Title ?? null,
      advisoryCard1Description: data.advisoryCard1Description ?? null,
      advisoryCard1ExampleQ: data.advisoryCard1ExampleQ ?? null,
      advisoryCard1Expert: data.advisoryCard1Expert ?? null,
      advisoryCard1Format: data.advisoryCard1Format ?? null,
      advisoryCard1CtaText: data.advisoryCard1CtaText ?? null,
      advisoryCard1CtaUrl: data.advisoryCard1CtaUrl ?? null,
      advisoryCard2Title: data.advisoryCard2Title ?? null,
      advisoryCard2Description: data.advisoryCard2Description ?? null,
      advisoryCard2Ongoing: data.advisoryCard2Ongoing ?? null,
      advisoryCard2DeepDive: data.advisoryCard2DeepDive ?? null,
      advisoryCard2Benchmarks: data.advisoryCard2Benchmarks ?? null,
      advisoryCard2CtaText: data.advisoryCard2CtaText ?? null,
      advisoryCard2CtaLink: data.advisoryCard2CtaLink ?? null,
    };

    const delegate = getDelegate();
    if (!delegate) {
      return NextResponse.json({ id: "advisory-page", ...payload });
    }
    const page = await delegate.upsert({
      where: { id: "advisory-page" },
      update: payload,
      create: { id: "advisory-page", ...payload },
    });
    return NextResponse.json(page);
  } catch (error: unknown) {
    const prismaError = error as { code?: string; message?: string };
    if (prismaError?.code === "P2022" && String(prismaError?.message ?? "").includes("heroTitle")) {
      return NextResponse.json(
        {
          error: "Falta la columna heroTitle. Ejecuta en tu base de datos: ALTER TABLE \"advisory_page\" ADD COLUMN IF NOT EXISTS \"heroTitle\" TEXT;",
        },
        { status: 503 }
      );
    }
    const msg = error instanceof Error ? error.message : "Failed to update advisory page";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
