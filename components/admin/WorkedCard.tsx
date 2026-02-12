"use client";

import { useState } from "react";
import Image from "next/image";

interface WorkedCardProps {
  worked: {
    id: string;
    name: string;
    image: string;
    url: string | null;
    description: string | null;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function WorkedCard({ worked, onEdit, onDelete }: WorkedCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-sm transition hover:shadow-lg lg:flex-row">
      {/* Logo - Izquierda (miniatura centrada) */}
      <div className="flex h-48 w-full items-center justify-center bg-white lg:h-auto lg:w-1/3">
        {imageError || !worked.image ? (
          <div className="flex h-full w-full items-center justify-center text-[var(--admin-text-muted)]">
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
          <div className="relative h-24 w-24 lg:h-32 lg:w-32">
            <Image
              src={worked.image}
              alt={worked.name}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              unoptimized
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>

      {/* Contenido - Derecha */}
      <div className="flex flex-1 flex-col p-5 lg:w-2/3">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-[var(--admin-text)]">
            {worked.name}
          </h3>
        </div>

        {/* URL si existe */}
        {worked.url && (
          <div className="mb-3 flex items-center gap-2">
            <svg className="h-4 w-4 text-[var(--admin-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.489a4 4 0 005.656 0l4-4a4 4 0 10-5.656-5.656l-1.1 1.1"
              />
            </svg>
            <a
              href={worked.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              {worked.url}
            </a>
          </div>
        )}

        {/* Descripción */}
        <div className="mb-4 flex-1">
          {worked.description ? (
            <p className="line-clamp-4 text-sm leading-relaxed text-[var(--admin-text-muted)]">
              {worked.description}
            </p>
          ) : (
            <p className="text-sm italic text-[var(--admin-text-muted)] opacity-60">
              No description available
            </p>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(worked.id);
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
              onDelete(worked.id);
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

