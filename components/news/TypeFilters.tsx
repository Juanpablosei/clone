interface TypeFiltersProps {
  types: string[];
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function TypeFilters({
  types,
  selectedType,
  onTypeChange,
}: TypeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {types.map((type) => (
        <button
          key={type}
          onClick={() => onTypeChange(type)}
          className={`w-24 rounded-full px-4 py-2 text-center text-sm font-medium transition ${
            selectedType === type
              ? "bg-primary text-white shadow-sm"
              : "bg-[var(--admin-surface)] text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
          }`}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

