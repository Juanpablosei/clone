"use client";

import { useEffect } from "react";
import Image from "next/image";
import { NewsBlock } from "./types";

interface NewsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type: string;
  date: string;
  blocks: NewsBlock[];
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function NewsPreviewModal({
  isOpen,
  onClose,
  title,
  type,
  date,
  blocks,
}: NewsPreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <h2 className="text-lg font-semibold text-foreground">News Preview</h2>
        <button
          onClick={onClose}
          className="rounded-lg p-2 text-muted transition hover:bg-muted/20 hover:text-foreground"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-12 sm:px-10 lg:px-16">
        <article className="mx-auto w-full max-w-5xl">
            <div className="mb-4 flex items-center gap-3 text-sm font-semibold text-primary-strong">
              <span className="rounded-full bg-[#e6f4ff] px-3 py-1">
                {type}
              </span>
              <span className="text-muted">{formatDate(date)}</span>
            </div>

            <h1 className="mb-6 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {title || "(No title)"}
            </h1>

            {/* Renderizar bloques */}
            {blocks && blocks.length > 0 ? (
              <div className="prose prose-lg max-w-none">
                {blocks.map((block, index) => {
                  switch (block.type) {
                    case "title":
                      return (
                        <h2 key={block.id || `block-${index}`} className="mb-6 text-3xl font-semibold text-foreground">
                          {block.content}
                        </h2>
                      );
                    case "image":
                      return block.imageUrl ? (
                        <div key={block.id || `block-${index}`} className="my-8 w-full overflow-hidden">
                          <Image
                            src={block.imageUrl}
                            alt="Article image"
                            width={1200}
                            height={800}
                            className="h-auto w-full rounded-[15px]"
                            unoptimized
                          />
                        </div>
                      ) : null;
                    case "content":
                      return block.content ? (
                        <div
                          key={block.id || `block-${index}`}
                          className="mb-6 text-base leading-relaxed text-foreground"
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      ) : null;
                    case "author":
                      return (() => {
                        const authors = (block.metadata as { authors?: Array<{ name: string; image: string; description: string }> })?.authors || [];
                        
                        if (authors.length === 0) return null;
                        
                        return (
                          <div key={block.id || `block-${index}`} className="my-12">
                            <h3 className="mb-6 text-lg font-medium text-muted">About the authors</h3>
                            <div className="space-y-6">
                              {authors.map((author, authorIndex) => (
                                <div key={authorIndex} className="flex items-start gap-4">
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
                                    <h4 className="mb-1 text-base font-semibold text-foreground">
                                      {author.name || "Unnamed Author"}
                                    </h4>
                                    {author.description && (
                                      <p className="text-sm leading-relaxed text-muted">
                                        {author.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })();
                    default:
                      return null;
                  }
                })}
              </div>
            ) : (
              <p className="text-muted">No content blocks added yet.</p>
            )}
          </article>
        </div>
    </div>
  );
}
