"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/** Imagen del bloque izquierdo; en el futuro vendrá de la base de datos */
export interface TestimonialCard {
  image: string;
  alt?: string;
}

export interface SuccessStoryCard {
  category: string;
  headline: string;
  ctaText: string;
  ctaHref: string;
}

export interface CarouselSlide {
  testimonial: TestimonialCard;
  successStory: SuccessStoryCard;
}

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    testimonial: { image: "/Professional_Discussion.png", alt: "Advisory" },
    successStory: {
      category: "SUCCESS STORY",
      headline: "AI Integration Generates Success in Healthcare",
      ctaText: "Read Full Story",
      ctaHref: "/success-stories/salesforce-integration-healthcare",
    },
  },
  {
    testimonial: { image: "/Conference.png", alt: "Conference" },
    successStory: {
      category: "CASE STUDY",
      headline: "Policy Guidance for Responsible AI Deployment",
      ctaText: "Read Full Story",
      ctaHref: "/success-stories/policy-guidance-ai-deployment",
    },
  },
  {
    testimonial: { image: "/Discussion.png", alt: "Discussion" },
    successStory: {
      category: "SUCCESS STORY",
      headline: "Workshop Series Builds Internal Capability",
      ctaText: "Read Full Story",
      ctaHref: "/success-stories/workshop-series-capability-building",
    },
  },
];

interface TestimonialsSuccessCarouselProps {
  slides?: CarouselSlide[];
}

export default function TestimonialsSuccessCarousel({
  slides = DEFAULT_SLIDES,
}: TestimonialsSuccessCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
    duration: 30,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index);
    },
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  if (slides.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-[1600px] py-12">
      <div className="relative">
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex">
            {slides.map((slide, index) => (
              <div
                key={index}
                className="embla__slide min-w-0 shrink-0"
                style={{ width: "100%", flex: "0 0 100%" }}
              >
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                  {/* Bloque izquierda: solo imagen (en el futuro vendrá de la BD) */}
                  <div className="relative h-[560px] w-full overflow-hidden rounded-2xl border border-border bg-surface">
                    <Image
                      src={slide.testimonial.image}
                      alt={slide.testimonial.alt ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>

                  {/* Card derecha: Success Story */}
                  <div className="relative flex min-h-[320px] flex-col overflow-hidden rounded-2xl bg-primary/10 p-6 sm:p-8">
                    <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-primary/15" />
                    <div className="absolute bottom-0 left-0 h-24 w-1/2 bg-gradient-to-tr from-primary/5 to-transparent" />
                    <div className="relative flex flex-1 flex-col">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                          {slide.successStory.category}
                        </span>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                          </svg>
                        </div>
                      </div>
                      <h3
                        className="text-xl font-semibold leading-tight text-foreground sm:text-2xl lg:text-3xl [&_.text-primary-strong]:text-primary-strong"
                        dangerouslySetInnerHTML={
                          slide.successStory.headline.includes("<span")
                            ? { __html: slide.successStory.headline }
                            : undefined
                        }
                      >
                        {!slide.successStory.headline.includes("<span") ? slide.successStory.headline : null}
                      </h3>
                      <div className="mt-auto pt-6">
                        <Link
                          href={slide.successStory.ctaHref}
                          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
                        >
                          {slide.successStory.ctaText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots de navegación */}
        <div className="mt-8 flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2.5 w-2.5 rounded-full transition ${
                index === selectedIndex
                  ? "bg-primary scale-110"
                  : "bg-border hover:bg-muted"
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
