import Image from "next/image";

interface ApproachSectionProps {
  image: string;
  label: string;
  title: string;
  content: string;
}

export default function ApproachSection({ image, label, title, content }: ApproachSectionProps) {
  return (
    <section id="approach" className="mx-auto w-full max-w-[1600px] scroll-mt-24 ">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
        {/* Texto a la izquierda */}
        <div className="order-2 flex flex-col gap-6 text-left lg:order-1 lg:text-right">
          <div className="w-[70%] lg:ml-auto">
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

        {/* Imagen a la derecha */}
        <div className="order-1 relative h-[400px] w-full overflow-hidden rounded-lg sm:h-[500px] lg:order-2 lg:h-[600px]">
          <Image
            src={image}
            alt={label}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>
    </section>
  );
}

