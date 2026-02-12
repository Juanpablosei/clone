interface FeaturesListProps {
  features: string[];
}

export default function FeaturesList({ features }: FeaturesListProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 border-t border-border pt-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-base text-foreground"
        >
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
            <svg
              className="h-3 w-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <span className="whitespace-nowrap">{feature}</span>
        </div>
      ))}
    </div>
  );
}
