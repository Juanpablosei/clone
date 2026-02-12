interface LoadMoreButtonProps {
  onClick: () => void;
  hasMore: boolean;
}

export default function LoadMoreButton({
  onClick,
  hasMore,
}: LoadMoreButtonProps) {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center pt-4">
      <button
        onClick={onClick}
        className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-strong"
      >
        Load more
      </button>
    </div>
  );
}

