import { prisma } from "../../lib/prisma";
import PartnersSectionContent from "./PartnersSectionContent";
import PartnersImageSection from "./PartnersImageSection";

interface Partner {
  id: string;
  name: string;
  image: string;
  url: string | null;
}

interface PartnersSectionProps {
  image?: string;
  imageAlt?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  subtitle?: string;
}

async function getPartners(): Promise<Partner[]> {
  try {
    const partners = await prisma.partner.findMany({
      orderBy: { createdAt: "asc" },
    });
    return partners;
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
}

export default async function PartnersSection({
  image,
  imageAlt,
  title,
  description,
  ctaText,
  ctaLink,
  subtitle,
}: PartnersSectionProps) {
  const partners = await getPartners();

  return (
    <section className="relative text-foreground">
      <div className="grid lg:grid-cols-2 lg:items-stretch">
        {/* Left Side - Image (extends to left edge) */}
        <div
          className="relative order-1 h-[400px] lg:order-1 lg:h-auto"
          style={{
            
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          <PartnersImageSection image={image} alt={imageAlt} />
        </div>

        {/* Right Side - Content */}
        <div className="relative z-10 order-2 bg-background px-6 py-16 sm:px-10 md:py-24 lg:order-2 lg:px-16">
          <PartnersSectionContent 
            partners={partners}
            title={title}
            description={description}
            ctaText={ctaText}
            ctaLink={ctaLink}
            subtitle={subtitle}
          />
        </div>
      </div>
    </section>
  );
}
