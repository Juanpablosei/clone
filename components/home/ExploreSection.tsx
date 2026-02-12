interface ExploreItem {
  title: string;
  description: string;
}

const exploreItems: ExploreItem[] = [
  {
    title: "Publications",
    description:"Research papers, technical reports and commentary that deepen understanding of AI capability, safety and sociotechnical impacts.",

  },
  {
    title: "Resources",
    description:"Practical frameworks, templates and tools to support responsible, evidence-based AI adoption and governance.",

  },
  {
    title: "Projects",
    description:"Case studies showcasing how we work with government, industry and civil society to design, assess and support responsible AI in practice.",

  },
];

export default function ExploreSection() {
  return (
    <section className="flex flex-col gap-10 rounded-3xl bg-surface p-8 sm:p-10 lg:p-12">
      <div className="flex flex-col gap-4">
        <span className="text-sm font-semibold uppercase tracking-[0.08em] text-primary-strong">
          Explore our work
        </span>
        <h2 className="text-3xl font-semibold text-foreground sm:text-4xl lg:text-5xl">
          Discover the ideas, insights and projects that shape our work.
        </h2>
        <p className="max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
          Explore key areas, publications and resources that highlight how we
          turn challenges into practical solutions.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {exploreItems.map((item) => (
          <div
            key={item.title}
            className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
          >
            <h3 className="text-xl font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

