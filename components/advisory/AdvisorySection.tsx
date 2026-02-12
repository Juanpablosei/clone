import Link from "next/link";

export interface AdvisorySectionProps {
  card1Title?: string;
  card1Description?: string;
  card1ExampleQuestions?: string;
  card1ExpertAccess?: string;
  card1Format?: string;
  card1CtaText?: string;
  card1CtaUrl?: string;
  card2Title?: string;
  card2Description?: string;
  card2Ongoing?: string;
  card2DeepDive?: string;
  card2Benchmarks?: string;
  card2CtaText?: string;
  card2CtaLink?: string;
}

const DEFAULTS: Required<AdvisorySectionProps> = {
  card1Title: "1-hour expert call",
  card1Description:
    "Focused sessions with our researchers and practitioners on capability, safety, and sociotechnical impact.",
  card1ExampleQuestions:
    "Clarify specific risks, limits, or opportunities; discuss how our research applies to your context; explore governance or deployment options.",
  card1ExpertAccess: "Direct access to Gradient researchers and practitioners.",
  card1Format: "1-hour video call, with optional pre-read or follow-up note.",
  card1CtaText: "Book a briefing",
  card1CtaUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules",
  card2Title: "Tailored consultations",
  card2Description:
    "Ongoing support for strategy, governance, and responsible deployment aligned with your context.",
  card2Ongoing: "Regular briefings and structured updates on capability, safety, and policy.",
  card2DeepDive: "Focused projects on risk assessment, benchmarks, or governance design.",
  card2Benchmarks: "Custom evaluation or benchmarking to support your decisions.",
  card2CtaText: "Start a conversation",
  card2CtaLink: "/contact-us",
};

export default function AdvisorySection(props: AdvisorySectionProps = {}) {
  const p = { ...DEFAULTS, ...props };
  const hasExternalCard1 = p.card1CtaUrl?.startsWith("http");

  return (
    <section className="mx-auto w-full max-w-[1600px]">
      <div className="flex flex-col gap-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-8">
            <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
              {p.card1Title}
            </h3>
            {p.card1Description && (
              <p className="text-base leading-relaxed text-muted">{p.card1Description}</p>
            )}
            <div className="flex flex-col gap-4">
              {p.card1ExampleQuestions && (
                <div>
                  <p className="mb-2 font-semibold text-foreground">Example questions:</p>
                  <p className="text-sm leading-relaxed text-muted">{p.card1ExampleQuestions}</p>
                </div>
              )}
              {p.card1ExpertAccess && (
                <div>
                  <p className="mb-2 font-semibold text-foreground">Expert access:</p>
                  <p className="text-sm leading-relaxed text-muted">{p.card1ExpertAccess}</p>
                </div>
              )}
              {p.card1Format && (
                <div>
                  <p className="mb-2 font-semibold text-foreground">The format:</p>
                  <p className="text-sm leading-relaxed text-muted">{p.card1Format}</p>
                </div>
              )}
            </div>
            {p.card1CtaText && (
              hasExternalCard1 ? (
                <a
                  href={p.card1CtaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
                >
                  {p.card1CtaText}
                </a>
              ) : (
                <Link
                  href={p.card1CtaUrl || "#"}
                  className="mt-auto inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
                >
                  {p.card1CtaText}
                </Link>
              )
            )}
          </div>

          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-8">
            <h3 className="text-2xl font-semibold text-foreground sm:text-3xl">
              {p.card2Title}
            </h3>
            {p.card2Description && (
              <p className="text-base leading-relaxed text-muted">{p.card2Description}</p>
            )}
            <div className="flex flex-col gap-4">
              {p.card2Ongoing && (
                <div>
                  <p className="mb-2 font-semibold text-foreground">Ongoing intelligence:</p>
                  <p className="text-sm leading-relaxed text-muted">{p.card2Ongoing}</p>
                </div>
              )}
              {p.card2DeepDive && (
                <div>
                  <p className="mb-2 font-semibold text-foreground">Deep-dive projects:</p>
                  <p className="text-sm leading-relaxed text-muted">{p.card2DeepDive}</p>
                </div>
              )}
              {p.card2Benchmarks && (
                <div>
                  <p className="mb-2 font-semibold text-foreground">Custom benchmarks:</p>
                  <p className="text-sm leading-relaxed text-muted">{p.card2Benchmarks}</p>
                </div>
              )}
            </div>
            {p.card2CtaText && p.card2CtaLink && (
              <Link
                href={p.card2CtaLink}
                className="mt-auto inline-flex items-center justify-center rounded-lg border border-primary bg-surface px-6 py-3 text-sm font-semibold text-primary-strong transition hover:bg-primary/5"
              >
                {p.card2CtaText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
