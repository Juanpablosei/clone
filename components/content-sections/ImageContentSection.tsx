import Image from "next/image";

export interface ImageContentSectionProps {
  image: string;
  imageAlt?: string;
  badge: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export default function ImageContentSection({
  image,
  imageAlt = "Content image",
  badge,
  title,
  description,
  icon,
}: ImageContentSectionProps) {
  return (
    <section className="relative flex h-[80vh] flex-col overflow-hidden rounded-lg lg:flex-row gap-4">
      <div className="relative h-full w-full overflow-hidden lg:w-1/2 rounded-3xl">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative flex h-full w-full flex-col justify-between bg-primary/10 lg:w-1/2 lg:bg-primary/15 rounded-3xl">
        <div className="relative flex flex-col gap-6 p-8 sm:p-10 lg:p-12">
          <span className="inline-flex w-fit items-center rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong">
            {badge}
          </span>

          {icon && (
            <div className="absolute right-8 top-8 flex h-12 w-12 items-center justify-center rounded-full bg-primary-strong sm:right-10 sm:top-10">
              {icon}
            </div>
          )}

          <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        </div>

        <div className="p-8 sm:p-10 lg:p-12 lg:pt-0">
          <p className="text-base leading-relaxed text-muted sm:text-lg lg:w-[70%]">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
