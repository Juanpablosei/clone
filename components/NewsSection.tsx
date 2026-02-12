import { prisma } from "../lib/prisma";
import NewsSectionClient, {
  NewsItem,
} from "./news/NewsSectionClient";
import { getPreviewImage, getPreviewContent } from "../lib/news-helpers";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function NewsSection() {
  let news: NewsItem[] = [];

  try {
    const records = await prisma.news.findMany({
      orderBy: { date: "desc" },
      include: {
        blocks: {
          orderBy: { order: "asc" },
        },
      },
    });

    news = records.map((item) => {
      // Extraer imagen y contenido de bloques si no existen campos legacy
      const previewImage = getPreviewImage(item.blocks, item.image);
      const previewContent = getPreviewContent(item.blocks, item.summary, item.content);

      return {
        id: item.id,
        title: item.title,
        image: previewImage,
        type: item.type,
        date: formatDate(item.date),
        summary: item.summary || previewContent,
        content: item.content || previewContent,
        url: item.url,
      };
    });
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  return <NewsSectionClient news={news} />;
}

