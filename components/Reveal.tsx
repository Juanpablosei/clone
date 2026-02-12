"use client";

import { motion } from "motion/react";

type Direction = "up" | "left" | "right";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article" | "header" | "footer" | "main";
  delay?: number; // optional delay in ms
  direction?: Direction;
}

export default function Reveal({
  children,
  className = "",
  as = "div",
  delay = 0,
  direction = "up",
}: RevealProps) {
  const translateValue = direction === "left" ? -20 : direction === "right" ? 20 : 20;
  const x = direction === "left" ? translateValue : direction === "right" ? translateValue : 0;
  const y = direction === "up" ? translateValue : 0;

  const MotionComponent = motion[as];

  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ amount: 0.15 }}
      transition={{
        duration: 0.3,
        delay: delay / 1000,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

