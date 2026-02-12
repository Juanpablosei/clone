import Hero from "../../components/Hero";
import ContactHeader from "../../components/contact/ContactHeader";
import ContactForm from "../../components/contact/ContactForm";
import ContactImageSection from "../../components/contact/ContactImageSection";
import Footer from "../../components/Footer";
import CTASection from "../../components/home/CTASection";
import { prisma } from "../../lib/prisma";

export default async function ContactUsPage() {
  // Obtener configuración del sitio para información de contacto
  let siteConfig = null;
  try {
    siteConfig = await prisma.siteConfig.findUnique({
      where: { id: "site-config" },
    });
  } catch (error) {
    console.error("Error fetching site config:", error);
  }

  const email = siteConfig?.email || "info@gradientinstitute.org";
  const linkedin = siteConfig?.linkedin || "https://www.linkedin.com/company/gradient-institute";
  
  // Por ahora usamos una imagen placeholder, puedes cambiarla después
  const contactImage = "/Professional_Discussion.png";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Hero title="Contact Us" />
      {/* Header con información de contacto */}
      <ContactHeader email={email} linkedin={linkedin} />

      {/* Main content section */}
      <main className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-16 lg:py-32">
        {/* Card grande con dos columnas */}
        <div className="rounded-3xl bg-primary/10 ">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-0 lg:items-stretch">
            {/* Left Column - Contact Form */}
            <div className="relative z-10 flex flex-col bg-blue-100 rounded-3xl p-8 sm:p-10 lg:p-12 lg:-mr-8">
              <ContactForm />
            </div>

            {/* Right Column - Image with floating CTA */}
            <div className="relative h-[400px] sm:h-[500px] lg:h-full">
              <ContactImageSection image={contactImage}  />
            </div>
          </div>
        </div>
      </main>

      <CTASection />
      <Footer />
    </div>
  );
}
