import Footer from "../components/Footer";
import LatestNews from "../components/LatestNews";
import HeaderSection from "../components/home/HeaderSection";
import AboutSection from "../components/home/AboutSection";
import HomeWhatWeDo from "../components/home/HomeWhatWeDo";
import ServiceSlideNewSection from "../components/home/ServiceSlideNewSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import CTASection from "../components/home/CTASection";
import PartnersSection from "../components/home/PartnersSection";
import { prisma } from "../lib/prisma";
import { auth } from "../lib/auth";
import { redirect } from "next/navigation";

// Hacer la página dinámica para que siempre muestre las noticias más recientes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  let homeData = null;
  
  try {
    homeData = await (prisma as unknown as { homePage: { findUnique: (args: { where: { id: string } }) => Promise<unknown> } }).homePage.findUnique({
      where: { id: "home-page" },
    });
  } catch (error) {
    console.error("Error fetching home page data:", error);
  }

  // Si no hay datos, usar valores por defecto
  const data = homeData as {
    id: string;
    headerTitle: string;
    headerSubtitle: string;
    aboutBadge: string;
    aboutTitle: string;
    aboutDescription: string;
    aboutImage: string;
    feature1Title: string;
    feature1Description: string;
    feature2Title: string;
    feature2Description: string;
    feature3Title: string;
    feature3Description: string;
    whatWeDoTitle: string;
    whatWeDoDescription: string;
    card1Title: string;
    card1Description: string;
    card1Link: string;
    card2Title: string;
    card2Description: string;
    card2Link: string;
    card3Title: string;
    card3Description: string;
    card3Link: string;
    ctaText: string;
    ctaButtonText: string;
    serviceImage?: string;
    serviceImageAlt?: string;
    testimonialsBadge?: string;
    testimonialsTitle?: string;
    testimonial1Quote?: string;
    testimonial1Author?: string;
    testimonial1Organization?: string;
    testimonial2Quote?: string;
    testimonial2Author?: string;
    testimonial2Organization?: string;
    testimonial3Quote?: string;
    testimonial3Author?: string;
    testimonial3Organization?: string;
    testimonial4Quote?: string;
    testimonial4Author?: string;
    testimonial4Organization?: string;
    partnersImage?: string;
    partnersTitle?: string;
    partnersDescription?: string;
    partnersCtaText?: string;
    partnersCtaLink?: string;
    partnersSubtitle?: string;
  } || {
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
    partnersImage: "/Workday.png",
    partnersTitle: "Partner with Gradient Institute",
    partnersDescription: "We collaborate with governments, research institutions, universities, industry, and civil society on work aligned with our public-interest mission. Our partnerships focus on bringing rigorous research and clear judgment into decisions where AI carries real societal consequences.",
    partnersCtaText: "Want to collaborate with us?",
    partnersCtaLink: "/contact",
    partnersSubtitle: "Some partners & collaborators include:",
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HeaderSection 
        title={data.headerTitle}
        subtitle={data.headerSubtitle}
      />

      <main className="flex flex-col ">
        <AboutSection 
          badge={data.aboutBadge}
          title={data.aboutTitle}
          description={data.aboutDescription}
          image={data.aboutImage}
          feature1Title={data.feature1Title}
          feature1Description={data.feature1Description}
          feature2Title={data.feature2Title}
          feature2Description={data.feature2Description}
          feature3Title={data.feature3Title}
          feature3Description={data.feature3Description}
        />
        <HomeWhatWeDo 
          title={data.whatWeDoTitle}
          description={data.whatWeDoDescription}
          card1Title={data.card1Title}
          card1Description={data.card1Description}
          card1Link={data.card1Link}
          card2Title={data.card2Title}
          card2Description={data.card2Description}
          card2Link={data.card2Link}
          card3Title={data.card3Title}
          card3Description={data.card3Description}
          card3Link={data.card3Link}
        />
        <ServiceSlideNewSection 
          image={data.serviceImage}
          alt={data.serviceImageAlt}
        />
        <LatestNews />
        <TestimonialsSection 
          badge={data.testimonialsBadge}
          title={data.testimonialsTitle}
          testimonials={[
            {
              quote: data.testimonial1Quote || "",
              author: data.testimonial1Author || "",
              organization: data.testimonial1Organization || "",
            },
            {
              quote: data.testimonial2Quote || "",
              author: data.testimonial2Author || "",
              organization: data.testimonial2Organization || "",
            },
            {
              quote: data.testimonial3Quote || "",
              author: data.testimonial3Author || "",
              organization: data.testimonial3Organization || "",
            },
            {
              quote: data.testimonial4Quote || "",
              author: data.testimonial4Author || "",
              organization: data.testimonial4Organization || "",
            },
          ]}
        />
        <PartnersSection 
          image={data.partnersImage}
          imageAlt="Partners"
          title={data.partnersTitle}
          description={data.partnersDescription}
          ctaText={data.partnersCtaText}
          ctaLink={data.partnersCtaLink}
          subtitle={data.partnersSubtitle}
        />
        <CTASection 
          text={data.ctaText}
          buttonText={data.ctaButtonText}
        />
      </main>
      <Footer />
    </div>
  );
}
