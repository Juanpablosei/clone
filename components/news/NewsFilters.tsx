import SearchBar from "./SearchBar";
import TypeFilters from "./TypeFilters";

interface NewsFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  types: string[];
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function NewsFilters({
  searchQuery,
  onSearchChange,
  types,
  selectedType,
  onTypeChange,
}: NewsFiltersProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 2xl:flex-row 2xl:items-center">
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      <TypeFilters
        types={types}
        selectedType={selectedType}
        onTypeChange={onTypeChange}
      />
    </div>
  );
}

