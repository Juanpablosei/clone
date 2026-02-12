import Image from "next/image";
import Link from "next/link";
import { generateSlug } from "../../lib/utils";

interface NewsCardProps {
  title: string;
  image: string | null;
  type: string;
  date: string;
  summary?: string | null;
  content: string | null;
  url?: string;
}

// Función helper para truncar texto
function truncateText(text: string | null | undefined, maxLength: number): string {
  if (!text) return "";
  
  // Limpiar HTML si existe
  const cleanText = text.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  return cleanText.substring(0, maxLength).trim() + "...";
}

export default function NewsCard({
  title,
  image,
  type,
  date,
  summary,
  content,
}: NewsCardProps) {
  const slug = generateSlug(title);
  const MAX_LENGTH = 240;
  const displayText = truncateText(summary || content, MAX_LENGTH);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      {image && (
        <div className="relative h-44 overflow-hidden bg-[#0f172a]">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            unoptimized
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-3 text-xs font-semibold text-primary-strong">
          <span className="rounded-full bg-[#e6f4ff] px-3 py-1">{type}</span>
          <span className="text-muted">{date}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        {displayText && (
          <p className="flex-1 text-sm text-muted line-clamp-3">
            {displayText}
          </p>
        )}
        <Link
          href={`/research-publications/${slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary-strong transition hover:text-primary"
        >
          Read more
          <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

