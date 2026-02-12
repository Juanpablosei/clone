"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  slug: string;
}

interface TeamCarouselProps {
  teamMembers: TeamMember[];
}

export default function TeamCarousel({ teamMembers }: TeamCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      skipSnaps: false,
      dragFree: false,
      duration: 35, // Transición más suave y lenta
      startIndex: 0,
    },
    [
      Autoplay({
        delay: 4500, // Cambia cada 4.5 segundos
        stopOnInteraction: false, // No se detiene al interactuar con las flechas
        stopOnMouseEnter: true, // Se detiene al pasar el mouse
      }),
    ]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative w-full py-8">
      {/* Flechas de navegación */}
      <button
        onClick={scrollPrev}
        className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-3 shadow-lg backdrop-blur-sm transition hover:bg-background"
        aria-label="Anterior"
      >
        <svg
          className="h-6 w-6 text-primary"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-3 shadow-lg backdrop-blur-sm transition hover:bg-background"
        aria-label="Siguiente"
      >
        <svg
          className="h-6 w-6 text-primary"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Contenedor del carrusel */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="embla__slide min-w-0 shrink-0"
              style={{ width: "280px", marginRight: "24px" }}
            >
              <Link
                href={`/about-us/people/${member.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative aspect-[0.75] w-full overflow-hidden bg-[#0f172a]">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    unoptimized
                  />
                </div>
                <div className="flex flex-col gap-2 p-5">
                  <h3 className="text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted">{member.role}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

