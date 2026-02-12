"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

interface SplitTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  splitBy?: "words" | "chars";
  delay?: number;
}

export default function SplitText({
  children,
  className = "",
  as = "span",
  splitBy = "words",
  delay = 0,
}: SplitTextProps) {
  const MotionTag = motion[as];

  const splitContent = splitBy === "words" 
    ? children.split(/(\s+)/).filter(item => item.length > 0)
    : children.split("");

  return (
    <MotionTag className={className}>
      {splitContent.map((item, index) => {
        const isWord = splitBy === "words";
        const isSpace = isWord && /^\s+$/.test(item);
        
        // Si es un espacio, renderizarlo sin animación
        if (isSpace) {
          return <span key={index}>{item}</span>;
        }

        return (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.05,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{ display: "inline-block" }}
          >
            {item}
          </motion.span>
        );
      })}
    </MotionTag>
  );
}

