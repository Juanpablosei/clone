import Image from "next/image";
import Link from "next/link";

interface AboutSectionProps {
  badge: string;
  title: string;
  description: string;
  image: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
}

export default function AboutSection({
  badge,
  title,
  description,
  image,
  feature1Title,
  feature1Description,
  feature2Title,
  feature2Description,
  feature3Title,
  feature3Description,
}: AboutSectionProps) {
  return (
    <section
      className="relative flex flex-col overflow-hidden lg:flex-row "
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
      }}
    >
      {/* Columna izquierda - Ocupa todo el ancho disponible */}
      <div className="w-full lg:w-1/2 bg-surface flex items-center">
        {/* Contenedor interno con máximo 800px */}
        <div className="w-full max-w-[800px] ml-auto flex flex-col gap-8 p-8 sm:p-10 lg:p-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Link
                href="/about-us"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e6f4ff] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong transition hover:bg-[#cce7ff]"
              >
                {badge}
              </Link>
              <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                {title}
              </h2>
            </div>
            <div className="h-px w-16 bg-gradient-to-r from-primary to-transparent" />
            <p className="text-base leading-relaxed text-muted sm:text-lg">
              {description}
            </p>
          </div>

          {/* Lista de características con iconos */}
          <div className="flex flex-col gap-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold leading-tight text-foreground">
                  {feature1Title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {feature1Description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold leading-tight text-foreground">
                  {feature2Title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {feature2Description}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold leading-tight text-foreground">
                  {feature3Title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {feature3Description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Columna derecha - Imagen que se extiende hasta el borde */}
      <div className="relative h-[500px] w-full overflow-hidden lg:h-auto lg:flex-1">
        <Image
          src={image || "/Professional_Discussion.png"}
          alt="Professional Discussion"
          fill
          className="object-cover"
          priority
        />
      </div>
    </section>
  );
}
