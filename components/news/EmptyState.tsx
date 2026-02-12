interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({
  message = "No news found with the selected filters.",
}: EmptyStateProps) {
  return (
    <div className="py-12 text-center text-muted">{message}</div>
  );
}

