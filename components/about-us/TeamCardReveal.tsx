"use client";

import { useEffect, useRef, useState } from "react";

interface TeamCardRevealProps {
  children: React.ReactNode;
  delay?: number;
  index?: number;
}

export default function TeamCardReveal({
  children,
  delay = 0,
  index = 0,
}: TeamCardRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Delay escalonado basado en el índice
            const staggerDelay = index * 50;
            setTimeout(() => {
              setVisible(true);
            }, staggerDelay + delay);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [delay, index]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-8 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

