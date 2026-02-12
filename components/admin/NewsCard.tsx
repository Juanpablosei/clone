"use client";

import { useState } from "react";
import Image from "next/image";

// Placeholder para cuando la imagen falla
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect fill='%23e5e7eb' width='128' height='128'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='%239ca3af'%3E?%3C/text%3E%3C/svg%3E";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    type: string;
    date: string;
    image: string | null;
    summary: string | null;
    author: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NewsCard({ news, onEdit, onDelete }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-sm transition hover:shadow-lg lg:flex-row">
      {/* Imagen - Izquierda */}
      <div className="relative h-48 w-full overflow-hidden bg-[var(--admin-primary-light)] lg:h-auto lg:w-1/3">
        {imageError || !news.image ? (
          <div className="flex h-full w-full items-center justify-center bg-[var(--admin-primary-light)] text-[var(--admin-text-muted)]">
            <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        ) : (
          <Image
            src={news.image}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            unoptimized
            onError={() => setImageError(true)}
          />
        )}
      </div>

      {/* Contenido - Derecha */}
      <div className="flex flex-1 flex-col p-5 lg:w-2/3">
        {/* Header con tipo y fecha */}
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {news.type}
          </span>
          <span className="text-xs font-medium text-[var(--admin-text-muted)]">
            {new Date(news.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Título */}
        <h3 className="mb-3 line-clamp-2 text-lg font-semibold leading-tight text-[var(--admin-text)]">
          {news.title}
        </h3>

        {/* Resumen - más visible */}
        <div className="mb-4 flex-1">
          {news.summary ? (
            <p className="line-clamp-4 text-sm leading-relaxed text-[var(--admin-text-muted)]">
              {news.summary}
            </p>
          ) : (
            <p className="text-sm italic text-[var(--admin-text-muted)] opacity-60">
              No summary available
            </p>
          )}
        </div>

        {/* Autor */}
        <div className="mb-4 flex items-center gap-2 border-t border-[var(--admin-border)] pt-3">
          <svg className="h-4 w-4 text-[var(--admin-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <p className="text-xs font-medium text-[var(--admin-text-muted)]">{news.author}</p>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(news.id);
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-primary bg-transparent px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(news.id);
            }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border-2 border-red-500 bg-transparent px-3 py-2 text-xs font-semibold text-red-500 transition hover:bg-red-500/10"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

