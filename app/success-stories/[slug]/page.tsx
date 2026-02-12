import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Footer from "../../../components/Footer";
import CTASection from "../../../components/home/CTASection";
import { prisma } from "../../../lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface SuccessStoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: SuccessStoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await prisma.aboutUsTestimonial.findUnique({
    where: { slug },
  });

  if (!story) {
    return {
      title: "Success Story Not Found",
    };
  }

  return {
    title: `${story.headline} | Gradient Institute`,
    description: story.summary,
    openGraph: {
      title: story.headline,
      description: story.summary,
      images: story.heroImage || story.image ? [story.heroImage || story.image] : [],
    },
  };
}

export default async function SuccessStoryPage({ params }: SuccessStoryPageProps) {
  const { slug } = await params;
  const story = await prisma.aboutUsTestimonial.findUnique({
    where: { slug },
  });

  if (!story) {
    notFound();
  }

  const heroImage = story.heroImage || story.image;
  const heroImageAlt = story.heroImageAlt || story.imageAlt || story.headline;
  const sections = (story.sections as Array<{ title: string; content: string }>) ?? [];

  const headlineIsHtml = story.headline.includes("<span");
  const headlineParts = !headlineIsHtml && story.highlightedWord
    ? story.headline.split(new RegExp(`(${story.highlightedWord})`, "i"))
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="mx-auto w-full max-w-[1600px] px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col gap-6">
              <span className="inline-flex w-fit items-center rounded-full bg-muted/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
                {story.category}
              </span>

              <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                {headlineIsHtml ? (
                  <span dangerouslySetInnerHTML={{ __html: story.headline }} />
                ) : headlineParts ? (
                  headlineParts.map((part, i) =>
                    part.toLowerCase() === story.highlightedWord?.toLowerCase() ? (
                      <span key={i} className="text-primary-strong">
                        {part}
                      </span>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )
                ) : (
                  story.headline
                )}
              </h1>

              <div
                className="text-base leading-relaxed text-muted sm:text-lg prose prose-p:my-2 [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={
                  story.summary?.startsWith("<")
                    ? { __html: story.summary }
                    : undefined
                }
              >
                {!story.summary?.startsWith("<") ? story.summary : null}
              </div>

              {story.industry && (
                <span className="inline-flex w-fit items-center text-xs font-semibold uppercase tracking-wider text-muted">
                  INDUSTRY: {story.industry}
                </span>
              )}

              {story.metric && (
                <div className="text-sm text-foreground">
                  <span className="font-semibold">{story.metric}</span>
                 
                </div>
              )}
            </div>

            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface">
                <Image
                  src={heroImage}
                  alt={heroImageAlt}
                  fill
                  className="h-auto w-full"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Separator */}
        <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-10 lg:px-16">
          <div className="flex justify-center border-t border-border pt-8">
            <span className="inline-flex items-center rounded-full bg-muted/30 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-foreground">
              THE STORY
            </span>
          </div>
        </div>

        {/* Story Content Sections */}
        <section className="mx-auto w-full max-w-[1600px] px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mx-auto max-w-4xl space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl">
                  {section.title}
                </h2>
                <div
                  className="text-base leading-relaxed text-muted sm:text-lg prose prose-p:my-2 [&_strong]:font-semibold [&_a]:text-primary [&_a]:underline whitespace-pre-line"
                  dangerouslySetInnerHTML={
                    section.content?.startsWith("<")
                      ? { __html: section.content }
                      : undefined
                  }
                >
                  {!section.content?.startsWith("<") ? section.content : null}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <CTASection />
      <Footer />
    </div>
  );
}
