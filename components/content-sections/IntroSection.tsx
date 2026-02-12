"use client";

import { useState } from "react";
import FeaturesList from "../education/FeaturesList";

export interface AccordionItem {
  title: string;
  content?: string;
}

export interface IntroSectionProps {
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  accordionItems?: AccordionItem[];
  features?: string[];
}

export default function IntroSection({
  badge = "OUR APPROACH",
  title = "Interactive Learning Approach",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  buttonText = "Get Started",
  buttonLink = "#",
  accordionItems = [
    { title: "Fee Only Financial Planning", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { title: "Fiduciary Financial Planning", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
    { title: "Professionals Only, No Salespeople", content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit." },
  ],
  features = [
    "College planning",
    "Income optimization",
    "Current cash flow needs",
    "Customized asset allocation",
    "Necessary insurance protection",
  ],
}: IntroSectionProps) {
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  return (
    <section className="flex flex-col gap-12 pb-8">
      <span className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong">
        {badge}
      </span>

      <div className="flex flex-col gap-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:w-[70%]">
            <h2 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          </div>
          <div className="hidden lg:block" />
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
          <div className="lg:w-[70%]">
            <p className="text-base leading-relaxed text-muted sm:text-lg">
              {description}
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col divide-y divide-border">
              {(accordionItems ?? []).map((item, index) => (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <h3 className="text-lg font-semibold leading-tight text-foreground">
                      {item.title}
                    </h3>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/20">
                      <svg
                        className={`h-4 w-4 text-muted transition-transform ${
                          openAccordion === index ? "rotate-45" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </div>
                  </button>
                  {item.content && (
                    <div
                      className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        openAccordion === index
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="mt-3 text-sm leading-relaxed text-muted">
                        {item.content}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <FeaturesList features={features ?? []} />
    </section>
  );
}
