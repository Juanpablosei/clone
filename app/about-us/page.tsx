import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
import AboutUsTeamSection from "../../components/about-us/AboutUsTeamSection";
import TestimonialsSuccessCarousel from "../../components/about-us/TestimonialsSuccessCarousel";
import MissionSection from "../../components/about-us/MissionSection";
import ApproachSection from "../../components/about-us/ApproachSection";
import HistorySection from "../../components/about-us/HistorySection";
import CTASection from "../../components/home/CTASection";
import { prisma } from "../../lib/prisma";

export default async function AboutUsPage() {
  let aboutUsData = null;
  
  try {
    // Intentar obtener los datos de la página
    aboutUsData = await (prisma as unknown as { aboutUsPage: { findUnique: (args: { where: { id: string } }) => Promise<unknown> } }).aboutUsPage.findUnique({
      where: { id: "about-us-page" },
    });
  } catch (error) {
    console.error("Error fetching about-us page data:", error);
    // Si hay error, aboutUsData queda como null
  }

  // Si no hay datos, no mostrar nada
  if (!aboutUsData) {
    return null;
  }

  const data = aboutUsData as {
    id: string;
    heroTitle: string;
    heroSubtitle: string;
    missionImage: string;
    missionLabel: string;
    missionTitle: string;
    missionContent: string;
    approachImage: string;
    approachLabel: string;
    approachTitle: string;
    approachContent: string;
    historyImage: string;
    historyLabel: string;
    historyTitle: string;
    historyContent: string;
  };

  // Testimonios del carrusel desde la base de datos
  let testimonialSlides: { testimonial: { image: string; alt?: string }; successStory: { category: string; headline: string; ctaText: string; ctaHref: string } }[] = [];
  try {
    const testimonials = await prisma.aboutUsTestimonial.findMany({
      orderBy: { order: "asc" },
    });
    testimonialSlides = testimonials.map((t) => ({
      testimonial: { image: t.image, alt: t.imageAlt ?? undefined },
      successStory: {
        category: t.category,
        headline: t.headline,
        ctaText: t.ctaText,
        ctaHref: `/success-stories/${t.slug}`,
      },
    }));
  } catch (err) {
    console.error("Error fetching testimonials:", err);
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero 
        title={data.heroTitle}
      />
      <main className="flex flex-col gap-20 px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <MissionSection 
          image={data.missionImage || ""}
          label={data.missionLabel || ""}
          title={data.missionTitle || ""}
          content={data.missionContent || ""}
        />

        <ApproachSection 
          image={data.approachImage || ""}
          label={data.approachLabel || ""}
          title={data.approachTitle || ""}
          content={data.approachContent || ""}
        />

        <HistorySection 
          image={data.historyImage || ""}
          label={data.historyLabel || ""}
          title={data.historyTitle || ""}
          content={data.historyContent || ""}
        />

        <div className="flex flex-col gap-4 ">
          <div 
            className="border-t border-border"
            style={{
              width: "100vw",
              marginLeft: "calc(-50vw + 50%)",
            }}
          ></div>
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-primary-strong">
            Our Team
          </span>
        </div>

        <AboutUsTeamSection />

        <TestimonialsSuccessCarousel slides={testimonialSlides} />
      </main>
      <CTASection />
      <Footer />
    </div>
  );
}

