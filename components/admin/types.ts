export interface AuthorInfo {
  name: string;
  image: string;
  description: string;
}

export interface NewsBlock {
  id?: string;
  type: "title" | "image" | "content" | "author";
  order: number;
  content?: string | null;
  imageUrl?: string | null;
  authorId?: string | null;
  metadata?: {
    authors?: AuthorInfo[];
  } | any;
}

export interface News {
  id?: string;
  title: string;
  date: string;
  type: string;
  url: string | null;
  authorId?: string | null;
  author?: {
    id: string;
    name: string;
    image: string;
    description?: string | null;
    linkedin?: string | null;
  } | null;
  blocks?: NewsBlock[];
  // Campos legacy (para compatibilidad)
  image?: string | null;
  images?: string[];
  summary?: string | null;
  content?: string | null;
}

