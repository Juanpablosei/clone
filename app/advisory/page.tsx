import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
import AdvisorySection from "../../components/advisory/AdvisorySection";
import CTASection from "../../components/home/CTASection";
import { IntroSection, ImageContentSection } from "../../components/content-sections";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdvisoryPageData = {
  heroTitle?: string | null;
  introBadge?: string | null;
  introTitle?: string | null;
  introDescription?: string | null;
  accordionItems?: Array<{ title: string; content?: string }> | null;
  features?: string[] | null;
  contentImage?: string | null;
  contentImageAlt?: string | null;
  contentBadge?: string | null;
  contentTitle?: string | null;
  contentDescription?: string | null;
  iconType?: string | null;
  advisorySectionTitle?: string | null;
  advisoryIntro1?: string | null;
  advisoryIntro2Before?: string | null;
  advisoryTermsLinkText?: string | null;
  advisoryTermsLinkHref?: string | null;
  advisoryIntro2After?: string | null;
  advisoryCard1Title?: string | null;
  advisoryCard1Description?: string | null;
  advisoryCard1ExampleQ?: string | null;
  advisoryCard1Expert?: string | null;
  advisoryCard1Format?: string | null;
  advisoryCard1CtaText?: string | null;
  advisoryCard1CtaUrl?: string | null;
  advisoryCard2Title?: string | null;
  advisoryCard2Description?: string | null;
  advisoryCard2Ongoing?: string | null;
  advisoryCard2DeepDive?: string | null;
  advisoryCard2Benchmarks?: string | null;
  advisoryCard2CtaText?: string | null;
  advisoryCard2CtaLink?: string | null;
};

const DEFAULT_ADVISORY_PAGE: AdvisoryPageData = {
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

export default async function AdvisoryPage() {
  let pageData: AdvisoryPageData | null = null;
  let ctaText = "Let's navigate AI responsibly together.";
  let ctaButtonText = "Contact us";

  try {
    const delegate = (prisma as unknown as { advisoryPage?: { findUnique: (args: { where: { id: string } }) => Promise<AdvisoryPageData | null> } })
      .advisoryPage;
    if (delegate && typeof delegate.findUnique === "function") {
      pageData = await delegate.findUnique({ where: { id: "advisory-page" } });
    }
  } catch {
    // Usar DEFAULT_ADVISORY_PAGE cuando no hay delegate o falla la BD
  }

  const data = pageData ?? DEFAULT_ADVISORY_PAGE;

  try {
    const home = await (prisma as unknown as { homePage: { findUnique: (args: { where: { id: string } }) => Promise<{ ctaText?: string; ctaButtonText?: string } | null> } })
      .homePage.findUnique({ where: { id: "home-page" } });
    if (home?.ctaText) ctaText = home.ctaText;
    if (home?.ctaButtonText) ctaButtonText = home.ctaButtonText;
  } catch {
    // use defaults
  }

  const accordionItems = Array.isArray(data.accordionItems) ? data.accordionItems : undefined;
  const features = Array.isArray(data.features) ? data.features : undefined;

  const renderIcon = () => {
    if (data.iconType === "chart") {
      return (
        <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero title={data.heroTitle ?? "Advisory & Guidance"} />
      <main className="flex flex-col gap-20 px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <IntroSection
          badge={data.introBadge ?? undefined}
          title={data.introTitle ?? undefined}
          description={data.introDescription ?? undefined}
          accordionItems={accordionItems}
          features={features}
        />
        {data.contentImage && data.contentBadge && data.contentTitle && data.contentDescription && (
          <ImageContentSection
            image={data.contentImage}
            imageAlt={data.contentImageAlt ?? undefined}
            badge={data.contentBadge}
            title={data.contentTitle}
            description={data.contentDescription}
            icon={renderIcon()}
          />
        )}
        <AdvisorySection
          card1Title={data.advisoryCard1Title ?? undefined}
          card1Description={data.advisoryCard1Description ?? undefined}
          card1ExampleQuestions={data.advisoryCard1ExampleQ ?? undefined}
          card1ExpertAccess={data.advisoryCard1Expert ?? undefined}
          card1Format={data.advisoryCard1Format ?? undefined}
          card1CtaText={data.advisoryCard1CtaText ?? undefined}
          card1CtaUrl={data.advisoryCard1CtaUrl ?? undefined}
          card2Title={data.advisoryCard2Title ?? undefined}
          card2Description={data.advisoryCard2Description ?? undefined}
          card2Ongoing={data.advisoryCard2Ongoing ?? undefined}
          card2DeepDive={data.advisoryCard2DeepDive ?? undefined}
          card2Benchmarks={data.advisoryCard2Benchmarks ?? undefined}
          card2CtaText={data.advisoryCard2CtaText ?? undefined}
          card2CtaLink={data.advisoryCard2CtaLink ?? undefined}
        />
      </main>
      <CTASection text={ctaText} buttonText={ctaButtonText} />
      <Footer />
    </div>
  );
}

