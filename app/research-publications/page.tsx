import NewsSection from "../../components/NewsSection";
import Footer from "../../components/Footer";
import Hero from "../../components/Hero";
import CTASection from "../../components/home/CTASection";
import { IntroSection, ImageContentSection } from "../../components/content-sections";
import { prisma } from "../../lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ResearchPageData = {
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
};

const DEFAULT_RESEARCH_PAGE: ResearchPageData = {
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

export default async function ResearchPublicationsPage() {
  let pageData: ResearchPageData | null = null;
  let ctaText = "Let's navigate AI responsibly together.";
  let ctaButtonText = "Contact us";

  try {
    const delegate = (prisma as unknown as { researchPublicationsPage?: { findUnique: (args: { where: { id: string } }) => Promise<ResearchPageData | null> } })
      .researchPublicationsPage;
    if (delegate) {
      pageData = await delegate.findUnique({ where: { id: "research-publications-page" } });
    }
  } catch (error) {
    console.error("Error fetching research publications page:", error);
  }

  const data = pageData ?? DEFAULT_RESEARCH_PAGE;

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
      <Hero
        title="Research & Publications"
      />
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
        <NewsSection />
      </main>
      <CTASection text={ctaText} buttonText={ctaButtonText} />
      <Footer />
    </div>
  );
}

