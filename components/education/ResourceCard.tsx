import Image from "next/image";

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    description: string;
    fileType: string;
    tags: string[];
    image?: string;
  };
  onDownloadClick: () => void;
}

export default function ResourceCard({
  resource,
  onDownloadClick,
}: ResourceCardProps) {
  return (
    <article className="flex h-full max-h-[500px] flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm">
      {resource.image && (
        <div className="relative h-44 shrink-0 overflow-hidden bg-[#0f172a]">
          <Image
            src={resource.image}
            alt={resource.title}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-3 p-5 overflow-hidden">
        <div className="flex items-center gap-3 shrink-0">
          <span className="rounded-full bg-[#e6f4ff] px-3 py-1 text-xs font-semibold text-primary-strong">
            {resource.fileType}
          </span>
          <div className="flex flex-wrap gap-1">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface border border-border px-2 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground line-clamp-2 shrink-0">
          {resource.title}
        </h3>
        <p className="flex-1 text-sm text-muted leading-relaxed line-clamp-3 overflow-hidden">
          {resource.description}
        </p>
        <button
          onClick={onDownloadClick}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download Resource
        </button>
      </div>
    </article>
  );
}

