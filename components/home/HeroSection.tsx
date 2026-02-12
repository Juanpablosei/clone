import Image from "next/image";
import { heroContent } from "../../constants/content";

export default function HeroSection() {
  return (
    <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e6f4ff] px-4 py-2 text-xs font-semibold text-primary-strong">
          {heroContent.badge}
        </span>
        <h1 className="text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl">
          {heroContent.title}
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          {heroContent.description}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-strong"
          >
            {heroContent.ctaPrimary}
          </a>
          <a
            href="#news"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary-strong"
          >
            {heroContent.ctaSecondary}
          </a>
        </div>
        <div className="mt-4 grid gap-4 text-sm text-muted sm:grid-cols-3">
          {heroContent.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface px-4 py-3 shadow-sm"
            >
              <p className="text-xs font-semibold text-primary-strong">
                {stat.label}
              </p>
              <p className="mt-1">{stat.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="relative h-[360px] overflow-hidden rounded-3xl bg-linear-to-br from-[#dcecff] via-[#bcd9ff] to-[#8fbaff]">
        <Image
          src="/img/_LzGaG2HmS-1280.png"
          alt="Gradient Institute hero"
          fill
          className="object-cover opacity-70"
          priority
        />
      </div>
    </section>
  );
}

