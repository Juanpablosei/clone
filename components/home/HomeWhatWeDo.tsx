import Link from "next/link";

interface HomeWhatWeDoProps {
  title: string;
  description: string;
  card1Title: string;
  card1Description: string;
  card1Link: string;
  card2Title: string;
  card2Description: string;
  card2Link: string;
  card3Title: string;
  card3Description: string;
  card3Link: string;
}

export default function HomeWhatWeDo({
  title,
  description,
  card1Title,
  card1Description,
  card1Link,
  card2Title,
  card2Description,
  card2Link,
  card3Title,
  card3Description,
  card3Link,
}: HomeWhatWeDoProps) {
  return (
    <section
      className="bg-primary/5 py-16 text-foreground md:py-24"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        {/* Título y Descripción en dos columnas */}
        <div className="mb-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div>
            <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-muted sm:text-xl">
              {description}
            </p>
          </div>
        </div>

        {/* Service Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 */}
          <div className="group bg-background p-8 transition">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-8 w-8 text-primary"
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
            <h3 className="mb-3 text-xl font-semibold text-foreground">
              {card1Title}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-muted">
              {card1Description}
            </p>
            <Link
              href={card1Link}
              className="inline-flex items-center text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition hover:decoration-primary"
            >
              Explore research
            </Link>
          </div>

          {/* Card 2 */}
          <div className="group bg-background p-8 transition">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-8 w-8 text-primary"
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
            <h3 className="mb-3 text-xl font-semibold text-foreground">
              {card2Title}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-muted">
              {card2Description}
            </p>
            <Link
              href={card2Link}
              className="inline-flex items-center text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition hover:decoration-primary"
            >
              Explore Advisory
            </Link>
          </div>

          {/* Card 3 */}
          <div className="group bg-background p-8 transition">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg
                className="h-8 w-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-foreground">
              {card3Title}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-muted">
              {card3Description}
            </p>
            <Link
              href={card3Link}
              className="inline-flex items-center text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition hover:decoration-primary"
            >
              Learn more about Education
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

