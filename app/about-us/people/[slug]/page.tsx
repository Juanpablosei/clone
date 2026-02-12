import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../../../lib/prisma";
import Footer from "../../../../components/Footer";
import CTASection from "../../../../components/home/CTASection";
import AtomicBackground from "../../../../components/home/AtomicBackground";

interface TeamMemberPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: TeamMemberPageProps): Promise<Metadata> {
  const { slug } = await params;
  const member = await prisma.teamMember.findUnique({ where: { slug } });

  if (!member) {
    return {
      title: "Team Member Not Found",
    };
  }

  return {
    title: `${member.name} | Gradient Institute`,
    description: member.description || `${member.name} - ${member.role}`,
  };
}

export default async function TeamMemberPage({
  params,
}: TeamMemberPageProps) {
  const { slug } = await params;
  const member = await prisma.teamMember.findUnique({ where: { slug } });

  if (!member) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero con nombre y puesto superpuestos */}
      <section
        className="relative w-full overflow-hidden border-b border-primary/20 h-[250px] sm:h-[400px] lg:h-[500px]"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          background: "linear-gradient(to right, rgba(91, 125, 214, 0.8), rgba(91, 125, 214, 0.3))",
        }}
      >
        {/* Efecto de átomos/partículas animado */}
        <AtomicBackground />
        <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center justify-center">
          <div className="px-6 text-center sm:px-10 lg:px-16">
            <div className="flex flex-col gap-4">
              <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
                {member.name}
              </h1>
              <p className="text-xl text-muted sm:text-2xl">{member.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <main className="flex flex-col">
        <article className="mx-auto w-full max-w-6xl px-6 py-12 sm:px-10 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            {/* Foto a la izquierda */}
            <div className="flex-shrink-0 lg:w-1/3">
              <div className="relative aspect-[0.75] w-full overflow-hidden rounded-2xl bg-[#0f172a]">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Social Links */}
              {(member.linkedin || member.x || member.url) && (
                <div className="mt-6 flex items-center justify-center gap-4">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition hover:text-primary-strong"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="h-10 w-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  )}
                  {member.x && (
                    <a
                      href={member.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition hover:text-primary-strong"
                      aria-label="X (Twitter)"
                    >
                      <svg
                        className="h-10 w-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                  )}
                  {member.url && (
                    <a
                      href={member.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted transition hover:text-primary-strong"
                      aria-label="Website"
                    >
                      <svg
                        className="h-10 w-10"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Descripción a la derecha */}
            <div className="flex-1 lg:pl-8">
              <div className="prose prose-lg max-w-none">
                {member.description ? (
                  <div
                    className="text-base leading-relaxed text-foreground [&>p]:mb-4"
                    dangerouslySetInnerHTML={{ __html: member.description }}
                  />
                ) : (
                  <p className="mb-4 text-base leading-relaxed text-foreground">
                    Próximamente agregaremos más información sobre {member.name}.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Botón de regreso */}
          <div className="mt-12 border-t border-border pt-8">
            <Link
              href="/about-us"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-strong transition hover:text-primary"
            >
              <span aria-hidden>←</span>
              Back to team
            </Link>
          </div>
        </article>
      </main>
      <CTASection />
      <Footer />
    </div>
  );
}

