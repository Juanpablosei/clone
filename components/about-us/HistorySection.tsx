import Image from "next/image";

interface HistorySectionProps {
  image: string;
  label: string;
  title: string;
  content: string;
}

export default function HistorySection({ image, label, title, content }: HistorySectionProps) {
  return (
    <section id="history" className="mx-auto w-full max-w-[1600px] scroll-mt-24">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        {/* Imagen a la izquierda */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-lg sm:h-[500px] lg:h-[600px]">
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover"
            unoptimized
          />
        </div>

        {/* Texto a la derecha */}
        <div className="flex flex-col gap-6 text-left">
          <div className="w-[70%]">
          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-primary-strong">
              {label}
            </span>
            <h2 className="mt-3 text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          </div>
          <div className="mt-6 prose prose-lg max-w-none">
            <div
              className="text-lg leading-relaxed text-muted"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}

