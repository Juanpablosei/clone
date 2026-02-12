import Image from "next/image";
import Link from "next/link";
import { prisma } from "../lib/prisma";
import { generateSlug } from "../lib/utils";
import TiltCard from "./TiltCard";
import { getPreviewImage, getPreviewContent } from "../lib/news-helpers";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text || typeof text !== "string") {
    return "";
  }
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + "...";
}

export default async function LatestNews() {
  // Obtener las últimas 3 noticias de la base de datos
  let latestNews: Array<{
    id: string;
    title: string;
    image: string | null;
    type: string;
    date: string;
    summary: string | null;
    content: string | null;
  }> = [];

  try {
    const records = await prisma.news.findMany({
      orderBy: { date: "desc" },
      take: 3,
      include: {
        blocks: {
          orderBy: { order: "asc" },
        },
      },
    });

    latestNews = records.map((item) => {
      // Extraer imagen y contenido de bloques si no existen campos legacy
      const previewImage = getPreviewImage(item.blocks, item.image);
      const previewContent = getPreviewContent(item.blocks, item.summary, item.content);

      return {
        id: item.id,
        title: item.title,
        image: previewImage,
        type: item.type,
        date: formatDate(item.date),
        summary: item.summary || previewContent,
        content: item.content || previewContent,
      };
    });
  } catch (error) {
    console.error("Error fetching latest news:", error);
  }

  return (
    <section id="news" className="flex flex-col gap-8">
      <div
        className="relative overflow-hidden py-6 sm:py-8 lg:py-10"
        style={{
          width: "100vw",
          marginLeft: "calc(-50vw + 50%)",
          background:
            "linear-gradient(to right, rgba(91, 125, 214, 0.08), rgba(255, 255, 255, 1), rgba(91, 125, 214, 0.08))",
        }}
      >
        <div className="mx-auto flex w-full max-w-[1600px] items-center justify-between px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-primary-strong">
              Latest news
            </span>
            <h2 className="text-3xl font-semibold text-foreground">
              Guidance, research and events
            </h2>
            <p className="max-w-2xl text-muted">
              Resources and reports to enable responsible AI adoption, designed
              with and for the community that regulates, builds and adopts AI
              systems.
            </p>
          </div>
          <Link
            href="/research-publications"
            className="hidden rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary-strong sm:inline-flex"
          >
            View all news
          </Link>
        </div>

        <div className="mx-auto w-full max-w-[1600px] px-6 sm:px-8 lg:px-10">
          {latestNews.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {latestNews.map((card) => (
                <TiltCard key={card.id}>
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  {card.image && (
                    <div className="relative h-44 overflow-hidden bg-[#0f172a]">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        unoptimized
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <div className="flex items-center gap-3 text-xs font-semibold text-primary-strong">
                      <span className="rounded-full bg-[#e6f4ff] px-3 py-1">
                        {card.type}
                      </span>
                      <span className="text-muted">{card.date}</span>
                    </div>
                    <h3 className="line-clamp-2 min-h-14 text-lg font-semibold leading-tight text-foreground">
                      {card.title}
                    </h3>
                    <p className="flex-1 text-sm text-muted">
                      {truncateText(card.summary || card.content || "", 150)}
                    </p>
                    <Link
                      href={`/research-publications/${generateSlug(card.title)}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary-strong transition hover:text-primary"
                    >
                      Read more
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </article>
                </TiltCard>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted">No news available at the moment.</p>
            </div>
          )}

          <div className="mt-8 flex justify-center sm:hidden">
            <Link
              href="/research-publications"
              className="rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary-strong"
            >
              View all news
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

