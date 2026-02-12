import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  const session = await auth();

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let homePage = await prisma.homePage.findUnique({
      where: { id: "home-page" },
    });

    // Si no existe, crear uno con valores por defecto
    if (!homePage) {
      homePage = await prisma.homePage.create({
        data: {
          id: "home-page",
          headerTitle: "Clarity in an uncertain AI landscape",
          headerSubtitle: "Trusted by organisations across government, industry, civil society, and the community.",
          aboutBadge: "About Gradient",
          aboutTitle: "Navigate AI with clarity and judgment",
          aboutDescription: "Gradient Institute is an independent nonprofit research organisation helping society understand and navigate AI as it really is. We conduct, distil, and interpret rigorous research to bring clarity where decisions are complex, stakes are high, and certainty is often assumed too quickly.",
          aboutImage: "/Professional_Discussion.png",
          feature1Title: "Independent research",
          feature1Description: "Rigorous, unbiased analysis of AI systems and risks, grounded in how they affect people, institutions, and society in practice.",
          feature2Title: "Public-interest insight",
          feature2Description: "Research designed to support policy, governance, and responsible use, with public benefit, not private advantage, as the guiding principle.",
          feature3Title: "Practical clarity",
          feature3Description: "Clear explanations that help people understand trade-offs, limits, and consequences so decisions are deliberate, not reactive.",
          whatWeDoTitle: "About Us",
          whatWeDoDescription: "Human and institutional agency can shape how AI is built, deployed, and used. Gradient exists to bring clarity into that fog, and therefore, to empower people to claim their agency, and with it, make deliberate choices, not resign to the \"inevitability\" narratives.",
          card1Title: "Deep, independent research",
          card1Description: "We conduct and distil rigorous research on AI capability, safety, and societal impact, going beyond surface narratives to understand how systems actually behave, and where risks and limits emerge in the real world.",
          card1Link: "/research-publications",
          card2Title: "Advisory and expert guidance",
          card2Description: "We work with governments, organisations, and civil society to bring scientific and policy insight into real decisions, helping people understand trade-offs, clarify options, and move forward thoughtfully as AI reshapes their environment.",
          card2Link: "/advisory",
          card3Title: "Education and capability building",
          card3Description: "We help people build genuine understanding of AI, what it can and cannot do, where it can go wrong, and how to engage responsibly, so decisions are informed by judgment, not pressure or hype.",
          card3Link: "/education-resources",
          ctaText: "Let's navigate AI responsibly together.",
          ctaButtonText: "Contact us",
          partnersImage: "/Workday.png",
          partnersTitle: "Partner with Gradient Institute",
          partnersDescription: "We collaborate with governments, research institutions, universities, industry, and civil society on work aligned with our public-interest mission. Our partnerships focus on bringing rigorous research and clear judgment into decisions where AI carries real societal consequences.",
          partnersCtaText: "Want to collaborate with us?",
          partnersCtaLink: "/contact",
          partnersSubtitle: "Some partners & collaborators include:",
          serviceImage: "/Conference.png",
          serviceImageAlt: "Conference",
          testimonialsBadge: "Testimonials",
          testimonialsTitle: "Why Our Clients Love to Work with Us!",
          testimonial1Quote: "Gradient helped us cut through noise and focus on what actually mattered. Their work brought clarity at a point where decisions carried real consequences.",
          testimonial1Author: "Senior policy advisor",
          testimonial1Organization: "government agency",
          testimonial2Quote: "What stood out was their independence. The guidance wasn't about pushing adoption, but about understanding trade-offs and making deliberate choices.",
          testimonial2Author: "Executive leader",
          testimonial2Organization: "industry organisation",
          testimonial3Quote: "Gradient made complex AI issues understandable without oversimplifying them. That balance is rare — and essential.",
          testimonial3Author: "Program lead",
          testimonial3Organization: "civil society organisation",
          testimonial4Quote: "The work didn't just explain AI — it helped people build judgment and confidence in how to engage with it responsibly.",
          testimonial4Author: "Participant",
          testimonial4Organization: "education program",
        },
      });
    }

    return NextResponse.json(homePage);
  } catch (error: unknown) {
    console.error("Error fetching home page:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch home page";
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
    if (!data.headerTitle || !data.headerSubtitle) {
      return NextResponse.json(
        { error: "Header title and subtitle are required" },
        { status: 400 }
      );
    }

    const homePage = await prisma.homePage.upsert({
      where: { id: "home-page" },
      update: {
        headerTitle: data.headerTitle,
        headerSubtitle: data.headerSubtitle,
        aboutBadge: data.aboutBadge || "",
        aboutTitle: data.aboutTitle || "",
        aboutDescription: data.aboutDescription || "",
        aboutImage: data.aboutImage || "",
        feature1Title: data.feature1Title || "",
        feature1Description: data.feature1Description || "",
        feature2Title: data.feature2Title || "",
        feature2Description: data.feature2Description || "",
        feature3Title: data.feature3Title || "",
        feature3Description: data.feature3Description || "",
        whatWeDoTitle: data.whatWeDoTitle || "",
        whatWeDoDescription: data.whatWeDoDescription || "",
        card1Title: data.card1Title || "",
        card1Description: data.card1Description || "",
        card1Link: data.card1Link || "",
        card2Title: data.card2Title || "",
        card2Description: data.card2Description || "",
        card2Link: data.card2Link || "",
        card3Title: data.card3Title || "",
        card3Description: data.card3Description || "",
        card3Link: data.card3Link || "",
        ctaText: data.ctaText || "",
        ctaButtonText: data.ctaButtonText || "",
        partnersImage: data.partnersImage || "",
        partnersTitle: data.partnersTitle || "",
        partnersDescription: data.partnersDescription || "",
        partnersCtaText: data.partnersCtaText || "",
        partnersCtaLink: data.partnersCtaLink || "",
        partnersSubtitle: data.partnersSubtitle || "",
        serviceImage: data.serviceImage || "",
        serviceImageAlt: data.serviceImageAlt || "",
        testimonialsBadge: data.testimonialsBadge || "",
        testimonialsTitle: data.testimonialsTitle || "",
        testimonial1Quote: data.testimonial1Quote || "",
        testimonial1Author: data.testimonial1Author || "",
        testimonial1Organization: data.testimonial1Organization || "",
        testimonial2Quote: data.testimonial2Quote || "",
        testimonial2Author: data.testimonial2Author || "",
        testimonial2Organization: data.testimonial2Organization || "",
        testimonial3Quote: data.testimonial3Quote || "",
        testimonial3Author: data.testimonial3Author || "",
        testimonial3Organization: data.testimonial3Organization || "",
        testimonial4Quote: data.testimonial4Quote || "",
        testimonial4Author: data.testimonial4Author || "",
        testimonial4Organization: data.testimonial4Organization || "",
      },
      create: {
        id: "home-page",
        headerTitle: data.headerTitle,
        headerSubtitle: data.headerSubtitle,
        aboutBadge: data.aboutBadge || "",
        aboutTitle: data.aboutTitle || "",
        aboutDescription: data.aboutDescription || "",
        aboutImage: data.aboutImage || "",
        feature1Title: data.feature1Title || "",
        feature1Description: data.feature1Description || "",
        feature2Title: data.feature2Title || "",
        feature2Description: data.feature2Description || "",
        feature3Title: data.feature3Title || "",
        feature3Description: data.feature3Description || "",
        whatWeDoTitle: data.whatWeDoTitle || "",
        whatWeDoDescription: data.whatWeDoDescription || "",
        card1Title: data.card1Title || "",
        card1Description: data.card1Description || "",
        card1Link: data.card1Link || "",
        card2Title: data.card2Title || "",
        card2Description: data.card2Description || "",
        card2Link: data.card2Link || "",
        card3Title: data.card3Title || "",
        card3Description: data.card3Description || "",
        card3Link: data.card3Link || "",
        ctaText: data.ctaText || "",
        ctaButtonText: data.ctaButtonText || "",
        partnersImage: data.partnersImage || "",
        partnersTitle: data.partnersTitle || "",
        partnersDescription: data.partnersDescription || "",
        partnersCtaText: data.partnersCtaText || "",
        partnersCtaLink: data.partnersCtaLink || "",
        partnersSubtitle: data.partnersSubtitle || "",
        serviceImage: data.serviceImage || "",
        serviceImageAlt: data.serviceImageAlt || "",
        testimonialsBadge: data.testimonialsBadge || "",
        testimonialsTitle: data.testimonialsTitle || "",
        testimonial1Quote: data.testimonial1Quote || "",
        testimonial1Author: data.testimonial1Author || "",
        testimonial1Organization: data.testimonial1Organization || "",
        testimonial2Quote: data.testimonial2Quote || "",
        testimonial2Author: data.testimonial2Author || "",
        testimonial2Organization: data.testimonial2Organization || "",
        testimonial3Quote: data.testimonial3Quote || "",
        testimonial3Author: data.testimonial3Author || "",
        testimonial3Organization: data.testimonial3Organization || "",
        testimonial4Quote: data.testimonial4Quote || "",
        testimonial4Author: data.testimonial4Author || "",
        testimonial4Organization: data.testimonial4Organization || "",
      },
    });

    return NextResponse.json(homePage);
  } catch (error: unknown) {
    console.error("Error updating home page:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update home page";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

