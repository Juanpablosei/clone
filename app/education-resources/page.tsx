import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
import CTASection from "../../components/home/CTASection";
import ResourcesSection from "../../components/education/ResourcesSection";
import { IntroSection, ImageContentSection } from "../../components/content-sections";
import { prisma } from "../../lib/prisma";

// Hacer la página dinámica para que siempre muestre los datos más recientes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EducationResourcesPage() {
  let educationData = null;
  
  try {
    educationData = await (prisma as unknown as { educationPage: { findUnique: (args: { where: { id: string } }) => Promise<unknown> } }).educationPage.findUnique({
      where: { id: "education-page" },
    });
  } catch (error) {
    console.error("Error fetching education page data:", error);
  }

  const data = educationData as {
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
  } || null;

  const accordionItems = Array.isArray(data?.accordionItems) ? data.accordionItems : undefined;
  const features = Array.isArray(data?.features) ? data.features : undefined;

  const renderIcon = () => {
    if (data?.iconType === "chart") {
      return (
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      );
    }
    return undefined;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero title="Education & Resources" />
      <main className="flex flex-col gap-20 px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <IntroSection
          badge={data?.introBadge || undefined}
          title={data?.introTitle || undefined}
          description={data?.introDescription || undefined}
          accordionItems={accordionItems}
          features={features}
        />
        {data?.contentImage && data?.contentBadge && data?.contentTitle && data?.contentDescription && (
          <ImageContentSection
            image={data.contentImage}
            imageAlt={data.contentImageAlt || undefined}
            badge={data.contentBadge}
            title={data.contentTitle}
            description={data.contentDescription}
            icon={renderIcon()}
          />
        )}
        <ResourcesSection />
      </main>
      <CTASection />
      <Footer />
    </div>
  );
}

