"use client";

import { useState, useEffect, useMemo } from "react";
import NewsForm from "../../../components/admin/NewsForm";
import NewsCard from "../../../components/admin/NewsCard";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import SearchBar from "../../../components/news/SearchBar";
import TypeFilters from "../../../components/news/TypeFilters";
import { getPreviewImage, getPreviewContent } from "../../../lib/news-helpers";
import { News } from "../../../components/admin/types";

// Extender el tipo News para incluir campos legacy
interface NewsWithLegacy extends News {
  image: string | null;
  images: string[];
  summary: string | null;
  content: string | null;
}

interface ProcessedNews extends Omit<News, 'author'> {
  id: string; // Asegurar que id sea requerido (no opcional)
  image: string | null; // Asegurar que image sea string | null, no undefined
  summary: string | null; // Asegurar que summary sea string | null, no undefined
  author: string; // String para mostrar en la UI
}

export default function NewsPage() {
  const [news, setNews] = useState<ProcessedNews[]>([]);
  const [rawNews, setRawNews] = useState<News[]>([]); // Mantener datos originales de la API
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    newsId: string | null;
    newsTitle: string | null;
  }>({
    isOpen: false,
    newsId: null,
    newsTitle: null,
  });

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/admin/news?t=${Date.now()}`);
      if (response.ok) {
        const data: NewsWithLegacy[] = await response.json();
        setRawNews(data); // Guardar datos originales
        // Procesar datos para extraer imagen y contenido de bloques
        const processedData: ProcessedNews[] = data
          .filter((item) => item.id) // Filtrar elementos sin id
          .map((item) => {
            const previewImage = getPreviewImage(item.blocks, item.image);
            const previewContent = getPreviewContent(item.blocks, item.summary, item.content);
            
            return {
              ...item,
              id: item.id!, // Asegurar que id existe (ya filtrado)
              image: previewImage ?? null, // Asegurar que nunca sea undefined
              summary: item.summary ?? previewContent ?? null, // Asegurar que nunca sea undefined
              author: item.author?.name || "No author",
            };
          });
        setNews(processedData);
      }
    } catch {
      console.error("Error fetching news");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingNews(null);
    fetchNews();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingNews(null);
  };

  const handleDelete = (id: string) => {
    const newsItem = news.find((n) => n.id === id);
    if (newsItem) {
      setDeleteModal({
        isOpen: true,
        newsId: id,
        newsTitle: newsItem.title,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.newsId) return;

    try {
      const response = await fetch(`/api/admin/news?id=${deleteModal.newsId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchNews();
        setDeleteModal({ isOpen: false, newsId: null, newsTitle: null });
      } else {
        alert("Error deleting news article");
      }
    } catch {
      alert("Error deleting news article");
    }
  };

  const handleEdit = (id: string) => {
    // Buscar en los datos originales (rawNews) para mantener la estructura correcta
    const newsItem = rawNews.find((n) => n.id === id);
    if (newsItem) {
      // Convertir NewsWithLegacy a News para el formulario
      const newsForForm: News = {
        id: newsItem.id,
        title: newsItem.title,
        date: newsItem.date,
        type: newsItem.type,
        url: newsItem.url,
        authorId: newsItem.authorId,
        author: newsItem.author,
        blocks: newsItem.blocks,
        image: newsItem.image,
        images: newsItem.images,
        summary: newsItem.summary,
        content: newsItem.content,
      };
      setEditingNews(newsForForm);
      setShowForm(true);
    }
  };

  // Tipos disponibles de noticias (debe coincidir con NEWS_TYPES en NewsForm)
  const NEWS_TYPES = [
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

  // Obtener tipos únicos de noticias existentes + todos los tipos disponibles
  const types = useMemo(() => {
    const existingTypes = Array.from(new Set(news.map((item) => item.type)));
    // Combinar tipos existentes con todos los tipos disponibles y eliminar duplicados
    const allTypes = Array.from(new Set([...NEWS_TYPES, ...existingTypes]));
    return ["All", ...allTypes.sort()];
  }, [news]);

  // Filtrar noticias
  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        item.title.toLowerCase().includes(searchLower) ||
        item.summary?.toLowerCase().includes(searchLower) ||
        item.author.toLowerCase().includes(searchLower) ||
        // Buscar también en el contenido de los bloques
        (item.blocks && item.blocks.some(
          (block) =>
            block.content?.toLowerCase().includes(searchLower) ||
            block.imageUrl?.toLowerCase().includes(searchLower)
        ));

      const matchesType = selectedType === "All" || item.type === selectedType;

      return matchesSearch && matchesType;
    });
  }, [news, searchQuery, selectedType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--admin-text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[var(--admin-text)]">News</h1>
        {!showForm && (
          <button
            onClick={() => {
              setEditingNews(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add News
          </button>
        )}
      </div>

      {showForm && (
        <NewsForm onSuccess={handleFormSuccess} onCancel={handleFormCancel} news={editingNews} />
      )}

      {!showForm && (
        <>
          {/* Búsqueda y Filtros */}
          <div className="flex flex-col gap-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 sm:flex-row sm:items-center">
            <div className="flex-1 sm:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by title, summary, or author..."
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <TypeFilters
                types={types}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
              />
            </div>
          </div>

          {/* Grid de noticias */}
          {filteredNews.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredNews.map((item) => (
                <NewsCard
                  key={`${item.id}-${item.image}`}
                  news={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-12 text-center">
              <svg
                className="mb-4 h-12 w-12 text-[var(--admin-text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium text-[var(--admin-text)]">No news found</p>
              <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                {searchQuery || selectedType !== "All"
                  ? "Try adjusting your search or filters"
                  : "Create your first news article"}
              </p>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, newsId: null, newsTitle: null })}
        onConfirm={confirmDelete}
        title="Delete News Article"
        message={`Are you sure you want to delete "${deleteModal.newsTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
      />
    </div>
  );
}

