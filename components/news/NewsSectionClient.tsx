"use client";

import { useMemo, useState } from "react";
import NewsFilters from "./NewsFilters";
import NewsGrid from "./NewsGrid";
import EmptyState from "./EmptyState";
import LoadMoreButton from "./LoadMoreButton";

const types = [
  "All articles",
  "All types",
  "Resource",
  "Submission",
  "Report",
  "Event",
  "Education",
  "Regulation",
  "News",
  "Explainer",
  "Position",
];

const ITEMS_PER_PAGE = 12;

export interface NewsItem {
  id: string;
  title: string;
  image: string | null;
  type: string;
  date: string;
  summary?: string | null;
  content: string | null;
  url?: string | null;
}

interface NewsSectionClientProps {
  news: NewsItem[];
}

export default function NewsSectionClient({ news }: NewsSectionClientProps) {
  const [selectedType, setSelectedType] = useState("All articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  const filteredNews = useMemo(() => {
    let filtered = news;

    // Filtrar por tipo
    if (selectedType !== "All articles" && selectedType !== "All types") {
      filtered = filtered.filter((item) => item.type === selectedType);
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.summary?.toLowerCase().includes(query) ||
          item.content?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [news, selectedType, searchQuery]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const displayedNews = filteredNews.slice(0, displayCount);
  const hasMore = filteredNews.length > displayCount;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <section id="news" className="flex flex-col gap-8">
      <NewsFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        types={types}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
      />

      {filteredNews.length > 0 ? (
        <>
          <NewsGrid news={displayedNews} />
          <LoadMoreButton onClick={handleLoadMore} hasMore={hasMore} />
        </>
      ) : (
        <EmptyState />
      )}
    </section>
  );
}

