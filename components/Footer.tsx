import Image from "next/image";
import { footerContent } from "../constants/content";
import { prisma } from "../lib/prisma";

export default async function Footer() {
  // Obtener configuración del sitio desde la base de datos
  const siteConfig = await prisma.siteConfig.findUnique({
    where: { id: "site-config" },
  });

  // Usar valores de la base de datos o fallback a valores estáticos
  const socialLinks = footerContent.social.map((social) => {
    if (social.label === "LinkedIn" && siteConfig?.linkedin) {
      return { label: social.label, href: siteConfig.linkedin };
    }
    if (social.label === "Twitter" && siteConfig?.twitter) {
      return { label: social.label, href: siteConfig.twitter };
    }
    return social;
  });
  return (
    <footer
      id="contact"
      className="relative bg-[#f0f4f8]"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
      }}
    >
      <div className="mx-auto w-full max-w-[1600px] px-6 py-12 sm:px-10 lg:px-16">
        <div className="flex flex-col gap-12">
        {/* Newsletter Section */}
        <div className="flex flex-col gap-4 border-b border-border pb-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-2 lg:max-w-md">
            <h3 className="text-lg font-semibold text-foreground">
              {footerContent.newsletter.title}
            </h3>
            <p className="text-sm text-muted">
              {footerContent.newsletter.description}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end lg:flex-1 lg:max-w-md lg:justify-end">
            <div className="flex-1">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
            >
              {footerContent.newsletter.button}
            </button>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
          {footerContent.sections.map((section) => (
            <div key={section.title} className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
                {section.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted transition hover:text-primary-strong"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-6 border-t border-border pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex items-center gap-6">
              <Image
                src="/gradient-large.svg"
                alt="Gradient Institute"
                width={120}
                height={34}
                className="h-8 w-auto"
              />
              <a
                href="https://www.ngosource.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="transition opacity-80 hover:opacity-100"
                aria-label="NGO Source"
              >
                <Image
                  src="/NGO.png"
                  alt="NGO Source"
                  width={120}
                  height={40}
                  className="h-10 w-auto"
                />
              </a>
              <a
                href="https://www.acnc.gov.au/charity/charities/c30bca43-0a3e-e911-a97c-000d3ad02a61/profile"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 transition opacity-80 hover:opacity-100"
                aria-label="ACNC Registered Charity"
              >
                <Image
                  src="/ACNC-Registered-Charity-Logo_mono.png"
                  alt="ACNC Registered Charity"
                  width={120}
                  height={48}
                  className="h-12 w-auto"
                />
              </a>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
              <span>{footerContent.copyright}</span>
              {footerContent.legal.map((link, index) => (
                <span key={link.label}>
                  {index > 0 && <span className="mx-2">•</span>}
                  <a
                    href={link.href}
                    className="transition hover:text-primary-strong"
                  >
                    {link.label}
                  </a>
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="text-sm font-medium text-muted transition hover:text-primary-strong"
                aria-label={social.label}
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
}

