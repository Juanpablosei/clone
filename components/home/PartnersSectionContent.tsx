import Image from "next/image";
import Link from "next/link";

interface Partner {
  id: string;
  name: string;
  image: string;
  url: string | null;
}

interface PartnersSectionContentProps {
  partners: Partner[];
  title?: string;
  description?: string;
  ctaText?: string;
  ctaLink?: string;
  subtitle?: string;
}

export default function PartnersSectionContent({ 
  partners,
  title = "Partner with Gradient Institute",
  description = "We collaborate with governments, research institutions, universities, industry, and civil society on work aligned with our public-interest mission. Our partnerships focus on bringing rigorous research and clear judgment into decisions where AI carries real societal consequences.",
  ctaText = "Want to collaborate with us?",
  ctaLink = "/contact",
  subtitle = "Some partners & collaborators include:",
}: PartnersSectionContentProps) {
  return (
    <div className="flex flex-col gap-8 py-16 md:py-24">
      {/* Title */}
      <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
        {title}
      </h2>

      {/* Description */}
      <p className="text-base leading-relaxed text-muted">
        {description}
      </p>

      {/* CTA Section */}
      <div className="flex flex-col gap-4">
        <p className="text-base font-medium text-foreground">
          {ctaText}
        </p>
        <Link
          href={ctaLink}
          className="inline-flex w-fit items-center justify-center rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary-strong"
        >
          Contact us
        </Link>
      </div>

      {/* Partners List */}
      {partners.length > 0 && (
        <div className="flex flex-col gap-4">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-muted">
            {subtitle}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-3">
            {partners.map((partner) => {
              const content = (
                <div
                  key={partner.id}
                  className="flex items-center justify-center rounded-lg border border-border bg-white px-4 py-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  title={partner.name}
                >
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    width={140}
                    height={60}
                    className="h-12 w-auto object-contain"
                    unoptimized
                  />
                </div>
              );

              return partner.url ? (
                <a
                  key={partner.id}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {content}
                </a>
              ) : (
                content
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

