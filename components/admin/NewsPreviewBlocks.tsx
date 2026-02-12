"use client";

import { NewsBlock, AuthorInfo } from "./types";
import Image from "next/image";

interface NewsPreviewBlocksProps {
  newsTitle?: string;
  blocks: NewsBlock[];
  onDelete: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

export default function NewsPreviewBlocks({
  newsTitle,
  blocks,
  onDelete,
  onMoveUp,
  onMoveDown,
}: NewsPreviewBlocksProps) {
  return (
    <div className="space-y-4">
      {/* Título de la noticia */}
      {newsTitle && (
        <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
          <h1 className="text-3xl font-bold text-[var(--admin-text)]">{newsTitle}</h1>
        </div>
      )}
      {blocks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] p-8 text-center">
          <p className="text-sm text-[var(--admin-text-muted)]">
            No blocks added yet. Use the buttons on the right to add blocks.
          </p>
        </div>
      ) : (
        blocks.map((block, index) => (
          <div
            key={block.id || `block-${index}`}
            className="group relative rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--admin-text-muted)]">
                {block.type.charAt(0).toUpperCase() + block.type.slice(1)} - Order: {block.order}
              </span>
              <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onMoveUp(index)}
                  disabled={index === 0}
                  className="rounded px-2 py-1 text-xs text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)] disabled:opacity-50"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => onMoveDown(index)}
                  disabled={index === blocks.length - 1}
                  className="rounded px-2 py-1 text-xs text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)] disabled:opacity-50"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(index)}
                  className="rounded px-2 py-1 text-xs text-red-500 transition hover:bg-red-50"
                  title="Delete block"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Renderizar contenido según el tipo */}
            {block.type === "title" && (
              <h2 className="text-2xl font-bold text-[var(--admin-text)]">
                {block.content || "(Empty title)"}
              </h2>
            )}

            {block.type === "image" && block.imageUrl && (
              <div className="w-full overflow-hidden">
                <Image
                  src={block.imageUrl}
                  alt="Block image"
                  width={800}
                  height={600}
                  className="h-auto w-full rounded-[15px]"
                  unoptimized
                />
              </div>
            )}

            {block.type === "image" && !block.imageUrl && (
              <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-[var(--admin-border)] bg-muted/20">
                <p className="text-xs text-[var(--admin-text-muted)]">No image</p>
              </div>
            )}

            {block.type === "content" && (
              <div
                className="prose prose-sm max-w-none text-[var(--admin-text)]"
                dangerouslySetInnerHTML={{
                  __html: block.content || "<p>(Empty content)</p>",
                }}
              />
            )}

            {block.type === "author" && (() => {
              const authors: AuthorInfo[] = (block.metadata?.authors as AuthorInfo[]) || [];
              
              if (authors.length === 0) {
                return (
                  <div className="text-sm text-[var(--admin-text-muted)] italic">
                    No authors added
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {authors.map((author, authorIndex) => (
                    <div
                      key={authorIndex}
                      className="flex items-start gap-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-secondary)] p-4"
                    >
                      {author.image && (
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={author.image}
                            alt={author.name || "Author"}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-[var(--admin-text)]">
                          {author.name || "(No name)"}
                        </h4>
                        {author.description && (
                          <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                            {author.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        ))
      )}
    </div>
  );
}

