import NewsCard from "./NewsCard";

interface NewsItem {
  title: string;
  image: string | null;
  type: string;
  date: string;
  summary?: string | null;
  content: string | null;
  url?: string | null;
}

interface NewsGridProps {
  news: NewsItem[];
}

export default function NewsGrid({ news }: NewsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {news.map((card) => (
        <NewsCard
          key={card.title}
          title={card.title}
          image={card.image}
          type={card.type}
          date={card.date}
          summary={card.summary ?? undefined}
          content={card.content ?? null}
          url={card.url ?? undefined}
        />
      ))}
    </div>
  );
}

