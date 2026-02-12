"use client";

import { useState } from "react";

interface TeamTabsProps {
  types: string[];
  labels: Record<string, string>;
  onTypeChange: (type: string) => void;
  activeType: string;
}

export default function TeamTabs({
  types,
  labels,
  onTypeChange,
  activeType,
}: TeamTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-border/50 pb-4">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
            activeType === type
              ? "bg-primary text-white shadow-md"
              : "bg-background text-muted hover:bg-muted/50 hover:text-foreground"
          }`}
        >
          {labels[type]}
        </button>
      ))}
    </div>
  );
}

