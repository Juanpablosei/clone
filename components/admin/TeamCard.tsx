"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// Placeholder para cuando la imagen falla
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect fill='%23e5e7eb' width='128' height='128'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='%239ca3af'%3E?%3C/text%3E%3C/svg%3E";

interface TeamCardProps {
  member: {
    id: string;
    name: string;
    role: string;
    image: string;
    description: string | null;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TeamCard({ member, onEdit, onDelete }: TeamCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Resetear el estado de error cuando cambia la imagen
  useEffect(() => {
    setImageError(false);
  }, [member.image]);

  return (
    <div className="relative h-[520px] w-full [perspective:1000px]">
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Frente de la card */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-sm [backface-visibility:hidden]">
          {/* Botón de flecha arriba */}
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="absolute right-4 top-4 z-10 rounded-full bg-primary/20 p-2 text-primary shadow-md transition hover:bg-primary/30 hover:shadow-lg"
            title={isFlipped ? "Ver información" : "Ver descripción"}
          >
            <svg
              className={`h-5 w-5 transition-transform duration-300 ${isFlipped ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>

          {/* Imagen al tope, mismo estilo que TeamCard público */}
          <div className="relative aspect-[0.75] w-full overflow-hidden bg-[#0f172a]">
            {imageError || !member.image ? (
              <div className="flex h-full w-full items-center justify-center">
                <svg
                  className="h-12 w-12 text-[var(--admin-text-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            ) : (
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover transition duration-500"
                unoptimized
                onError={() => setImageError(true)}
              />
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 px-5 py-4">
            <h3 className="text-lg font-semibold text-[var(--admin-text)]">{member.name}</h3>
            <p className="text-sm text-[var(--admin-text-muted)]">{member.role}</p>
            <div className="mt-auto flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(member.id);
              }}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border-2 border-primary bg-transparent px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/10"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(member.id);
              }}
              className="flex flex-1 items-center justify-center gap-1 rounded-lg border-2 border-red-500 bg-transparent px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-500/10"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
          </div>
        </div>

        {/* Reverso de la card */}
        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-sm [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {/* Botón de flecha arriba en el reverso también */}
          <button
            onClick={() => setIsFlipped(!isFlipped)}
            className="absolute right-4 top-4 z-10 rounded-full bg-primary/20 p-2 text-primary shadow-md transition hover:bg-primary/30 hover:shadow-lg"
            title="Ver información"
          >
            <svg
              className="h-5 w-5 rotate-180 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>

          <div className="scrollbar-primary flex-1 overflow-y-auto px-6 py-6 pt-14">
            <div
              className="prose prose-sm max-w-none text-center text-sm text-[var(--admin-text)] [&_*]:text-[var(--admin-text)]"
              dangerouslySetInnerHTML={{
                __html: member.description || "No description available",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

