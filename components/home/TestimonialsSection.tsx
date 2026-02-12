interface Testimonial {
  quote: string;
  author: string;
  organization: string;
}

interface TestimonialsSectionProps {
  badge?: string;
  title?: string;
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({
  badge = "Testimonials",
  title = "Why Our Clients Love to Work with Us!",
  testimonials = [
    {
      quote:
        "Gradient helped us cut through noise and focus on what actually mattered. Their work brought clarity at a point where decisions carried real consequences.",
      author: "Senior policy advisor",
      organization: "government agency",
    },
    {
      quote:
        "What stood out was their independence. The guidance wasn't about pushing adoption, but about understanding trade-offs and making deliberate choices.",
      author: "Executive leader",
      organization: "industry organisation",
    },
    {
      quote:
        "Gradient made complex AI issues understandable without oversimplifying them. That balance is rare — and essential.",
      author: "Program lead",
      organization: "civil society organisation",
    },
    {
      quote:
        "The work didn't just explain AI — it helped people build judgment and confidence in how to engage with it responsibly.",
      author: "Participant",
      organization: "education program",
    },
  ],
}: TestimonialsSectionProps) {

  return (
    <section className="py-16 text-foreground md:py-24">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-12 flex flex-col items-center gap-6">
          <div className="flex flex-col items-center gap-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong">
              {badge}
            </span>
            <h2 className="text-center text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          </div>
        </div>

        {/* Testimonial Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 bg-primary/10 p-6"
            >
              {/* Comillas grandes */}
              <div className="text-5xl font-serif leading-none text-primary">
                &ldquo;
              </div>
              
              {/* Texto del testimonio */}
              <p className="flex-1 text-sm leading-relaxed text-foreground">
                {testimonial.quote}
              </p>
              
              {/* Autor y organización */}
              <div className="flex flex-col gap-1 pt-4">
                <p className="text-sm font-semibold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-xs text-muted">
                  {testimonial.organization}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

