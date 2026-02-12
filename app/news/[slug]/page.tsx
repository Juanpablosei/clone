import { redirect } from "next/navigation";

interface NewsArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  redirect(`/research-publications/${slug}`);
}

