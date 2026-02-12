import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import Footer from "../../../components/Footer";
import CTASection from "../../../components/home/CTASection";
import { generateSlug } from "../../../lib/utils";
import NewsCard from "../../../components/news/NewsCard";
import { getPreviewImage, getPreviewContent } from "../../../lib/news-helpers";

// Hacer la página dinámica para que siempre muestre las noticias más recientes
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface NewsArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

async function getArticle(slug: string) {
  // Primero intentar por url (slug guardado)
  const byUrl = await prisma.news.findUnique({
    where: { url: slug },
    include: {
      author: true,
      blocks: {
        orderBy: { order: "asc" },
      },
    },
  });
  if (byUrl) return byUrl;

  // Fallback: buscar por título que genere el mismo slug
  const all = await prisma.news.findMany({
    include: {
      author: true,
      blocks: {
        orderBy: { order: "asc" },
      },
    },
  });
  return all.find((item) => generateSlug(item.title) === slug) || null;
}

export async function generateMetadata({
  params,
}: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: "Article Not Found",
    };
  }

  const previewContent = getPreviewContent(article.blocks, article.summary, article.content);
  const desc = article.summary || (previewContent ? previewContent.substring(0, 160) : "") || "";
  const previewImage = getPreviewImage(article.blocks, article.image);

  return {
    title: `${article.title} | Gradient Institute`,
    description: desc,
    openGraph: {
      title: article.title,
      description: desc,
      images: previewImage ? [previewImage] : [],
    },
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="flex flex-col">
        {/* Article Content */}
        <article className="mx-auto w-full max-w-5xl px-6 py-12 sm:px-10 lg:px-16">
          <div className="mb-4 flex items-center gap-3 text-sm font-semibold text-primary-strong">
            <span className="rounded-full bg-[#e6f4ff] px-3 py-1">
              {article.type}
            </span>
            <span className="text-muted">{formatDate(article.date)}</span>
          </div>

          <h1 className="mb-6 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
            {article.title}
          </h1>

          {/* Mostrar imagen de preview solo si NO hay bloques o si hay bloques pero no hay bloques de imagen */}
          {(() => {
            const hasImageBlocks = article.blocks && article.blocks.some(block => block.type === "image" && block.imageUrl);
            const previewImage = getPreviewImage(article.blocks, article.image);
            
            // Solo mostrar preview si no hay bloques de imagen (para contenido legacy)
            if (!hasImageBlocks && previewImage) {
              return (
                <div className="mb-10 w-full overflow-hidden">
                  <Image
                    src={previewImage}
                    alt={article.title}
                    width={1200}
                    height={800}
                    className="h-auto w-full rounded-[15px]"
                    priority
                    unoptimized
                  />
                </div>
              );
            }
            return null;
          })()}

          {article.summary && (
            <p className="mb-8 text-xl text-muted">{article.summary}</p>
          )}

          {/* Renderizar bloques si existen, sino usar content legacy */}
          {article.blocks && article.blocks.length > 0 ? (
            <div className="prose prose-lg max-w-none">
              {article.blocks.map((block, index) => {
                switch (block.type) {
                  case "title":
                    return (
                      <h2 key={block.id || `block-${index}`} className="mb-6 text-3xl font-semibold text-foreground">
                        {block.content}
                      </h2>
                    );
                  case "image":
                    return block.imageUrl ? (
                      <div key={block.id || `block-${index}`} className="my-8 w-full overflow-hidden">
                        <Image
                          src={block.imageUrl}
                          alt="Article image"
                          width={1200}
                          height={800}
                          className="h-auto w-full rounded-[15px]"
                          unoptimized
                        />
                      </div>
                    ) : null;
                  case "content":
                    return block.content ? (
                      <div
                        key={block.id || `block-${index}`}
                        className="mb-6 text-base leading-relaxed text-foreground"
                        dangerouslySetInnerHTML={{ __html: block.content }}
                      />
                    ) : null;
                  case "author":
                    return (() => {
                      const authors = (block.metadata as { authors?: Array<{ name: string; image: string; description: string }> })?.authors || [];
                      
                      if (authors.length === 0) return null;
                      
                      return (
                        <div key={block.id || `block-${index}`} className="my-12">
                          <h3 className="mb-6 text-lg font-medium text-muted">About the authors</h3>
                          <div className="space-y-6">
                            {authors.map((author, authorIndex) => (
                              <div key={authorIndex} className="flex items-start gap-4">
                                {author.image && (
                                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                                    <Image
                                      src={author.image}
                                      alt={author.name || "Author"}
                                      fill
                                      className="object-cover"
                                      unoptimized
                                    />
                                  </div>
                                )}
                                <div className="flex-1">
                                  <h4 className="mb-1 text-base font-semibold text-foreground">
                                    {author.name || "Unnamed Author"}
                                  </h4>
                                  {author.description && (
                                    <p className="text-sm leading-relaxed text-muted">
                                      {author.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })();
                  default:
                    return null;
                }
              })}
            </div>
          ) : article.content ? (
            <div className="prose prose-lg max-w-none">
              <div className="whitespace-pre-line text-base leading-relaxed text-foreground [&>p]:mb-6">
                {article.content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-12 border-t border-border pt-8">
            <Link
              href="/research-publications"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-strong transition hover:text-primary"
            >
              <span aria-hidden>←</span>
              Back to all articles
            </Link>
          </div>
        </article>

        {/* Related News */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 sm:px-10 lg:px-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground">Related news</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {(await prisma.news.findMany({
              orderBy: { date: "desc" },
              take: 10,
              include: {
                blocks: {
                  orderBy: { order: "asc" },
                },
              },
            }))
              .filter((item) => generateSlug(item.title) !== slug)
              .slice(0, 3)
              .map((item) => {
                const previewImage = getPreviewImage(item.blocks, item.image);
                const previewContent = getPreviewContent(item.blocks, item.summary, item.content);
                
                return (
                  <NewsCard
                    key={item.id}
                    title={item.title}
                    image={previewImage}
                    type={item.type}
                    date={formatDate(item.date)}
                    summary={item.summary || previewContent || undefined}
                    content={item.content || previewContent}
                    url={item.url ?? undefined}
                  />
                );
              })}
          </div>
        </section>
      </main>
      <CTASection />
      <Footer />
    </div>
  );
}

