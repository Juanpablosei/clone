import { NextResponse } from "next/server";
import { auth } from "../../../../../lib/auth";
import { prisma } from "../../../../../lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const testimonials = await prisma.aboutUsTestimonial.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Error fetching about-us testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.image || !data.category || !data.headline || !data.ctaText || !data.slug || !data.summary) {
      return NextResponse.json(
        { error: "Image, category, headline, ctaText, slug and summary are required" },
        { status: 400 }
      );
    }

    const slug = String(data.slug).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!slug) {
      return NextResponse.json({ error: "Slug cannot be empty" }, { status: 400 });
    }
    const existing = await prisma.aboutUsTestimonial.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: "A success story with this slug already exists" }, { status: 400 });
    }

    const maxOrder = await prisma.aboutUsTestimonial.aggregate({
      _max: { order: true },
    });
    const order = (maxOrder._max.order ?? -1) + 1;

    const testimonial = await prisma.aboutUsTestimonial.create({
      data: {
        image: data.image,
        imageAlt: data.imageAlt ?? null,
        category: data.category,
        headline: data.headline,
        ctaText: data.ctaText,
        slug,
        summary: data.summary,
        industry: data.industry ?? null,
        heroImage: data.heroImage ?? null,
        heroImageAlt: data.heroImageAlt ?? null,
        highlightedWord: data.highlightedWord ?? null,
        metric: data.metric ?? null,
        metricDescription: data.metricDescription ?? null,
        sections: Array.isArray(data.sections) ? data.sections : null,
        order,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }
    if (!data.image || !data.category || !data.headline || !data.ctaText || !data.slug || !data.summary) {
      return NextResponse.json(
        { error: "Image, category, headline, ctaText, slug and summary are required" },
        { status: 400 }
      );
    }

    const slug = String(data.slug).trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    if (!slug) {
      return NextResponse.json({ error: "Slug cannot be empty" }, { status: 400 });
    }
    const existing = await prisma.aboutUsTestimonial.findUnique({ where: { slug } });
    if (existing && existing.id !== data.id) {
      return NextResponse.json({ error: "Another success story already uses this slug" }, { status: 400 });
    }

    const testimonial = await prisma.aboutUsTestimonial.update({
      where: { id: data.id },
      data: {
        image: data.image,
        imageAlt: data.imageAlt ?? null,
        category: data.category,
        headline: data.headline,
        ctaText: data.ctaText,
        slug,
        summary: data.summary,
        industry: data.industry ?? null,
        heroImage: data.heroImage ?? null,
        heroImageAlt: data.heroImageAlt ?? null,
        highlightedWord: data.highlightedWord ?? null,
        metric: data.metric ?? null,
        metricDescription: data.metricDescription ?? null,
        sections: Array.isArray(data.sections) ? data.sections : null,
        order: typeof data.order === "number" ? data.order : undefined,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Error updating testimonial:", error);
    return NextResponse.json(
      { error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.aboutUsTestimonial.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    return NextResponse.json(
      { error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
