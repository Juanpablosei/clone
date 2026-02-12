"use client";

import React from "react";
import Image from "next/image";

interface NewsPreviewProps {
  title: string;
  type: string;
  date: string;
  image: string;
  images: string[];
  summary: string | null;
  content: string;
  author: string;
  pendingMainImage?: File | null; // Archivo pendiente para la imagen principal
  pendingAdditionalImages?: File[]; // Archivos pendientes para imágenes adicionales
}

export default function NewsPreview({
  title,
  type,
  date,
  image,
  images,
  summary,
  content,
  author,
  pendingMainImage,
  pendingAdditionalImages = [],
}: NewsPreviewProps) {
  // Crear URL de preview para la imagen principal pendiente
  const [mainImagePreview, setMainImagePreview] = React.useState<string | null>(null);
  
  React.useEffect(() => {
    if (pendingMainImage) {
      const url = URL.createObjectURL(pendingMainImage);
      setMainImagePreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setMainImagePreview(null);
    }
  }, [pendingMainImage]);

  // Crear URLs de preview para imágenes adicionales pendientes
  const [additionalPreviews, setAdditionalPreviews] = React.useState<string[]>([]);
  
  React.useEffect(() => {
    if (pendingAdditionalImages.length > 0) {
      const urls = pendingAdditionalImages.map((file) => URL.createObjectURL(file));
      setAdditionalPreviews(urls);
      return () => {
        urls.forEach((url) => URL.revokeObjectURL(url));
      };
    } else {
      setAdditionalPreviews([]);
    }
  }, [pendingAdditionalImages]);
  return (
    <div className="sticky top-6 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-sm">
      <div className="mb-4 text-xs font-medium text-[var(--admin-text-muted)]">Preview</div>

      <article className="space-y-6">
        {/* Type and Date */}
        <div className="flex items-center gap-3 text-sm font-semibold text-primary-strong">
          <span className="rounded-full bg-[#e6f4ff] px-3 py-1">{type || "News"}</span>
          <span className="text-[var(--admin-text-muted)]">{date ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString()}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-semibold leading-tight text-[var(--admin-text)] sm:text-3xl">
          {title || "Article Title"}
        </h1>

        {/* Main Image */}
        {mainImagePreview || image ? (
          <div className="w-full overflow-hidden">
            <Image
              src={mainImagePreview || image}
              alt={title || "Article image"}
              width={800}
              height={600}
              className="h-auto w-full rounded-[15px]"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-48 items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20">
            <p className="text-sm text-[var(--admin-text-muted)]">No main image</p>
          </div>
        )}

        {/* Summary */}
        {summary && (
          <p className="text-base text-[var(--admin-text-muted)]">{summary}</p>
        )}

        {/* Secondary Images */}
        {(images && images.length > 0) || additionalPreviews.length > 0 ? (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-[var(--admin-text)]">Additional Images</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Imágenes ya subidas */}
              {images.map((img, index) => (
                <div key={`uploaded-${index}`} className="w-full overflow-hidden">
                  <Image
                    src={img}
                    alt={`Additional image ${index + 1}`}
                    width={400}
                    height={300}
                    className="h-auto w-full rounded-[15px]"
                    unoptimized
                  />
                </div>
              ))}
              {/* Imágenes pendientes */}
              {additionalPreviews.map((previewUrl, index) => (
                <div key={`pending-${index}`} className="w-full overflow-hidden rounded-[15px] border-2 border-dashed border-primary/30">
                  <Image
                    src={previewUrl}
                    alt={`Pending image ${index + 1}`}
                    width={400}
                    height={300}
                    className="h-auto w-full rounded-[15px]"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Content */}
        <div className="prose prose-sm max-w-none">
          {content ? (
            <div
              className="text-sm leading-relaxed text-[var(--admin-text)] [&_*]:text-[var(--admin-text)]"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <p className="text-sm text-[var(--admin-text-muted)] italic">No content yet...</p>
          )}
        </div>

        {/* Author */}
        {author && (
          <div className="border-t border-border pt-4">
            <p className="text-xs text-[var(--admin-text-muted)]">By {author}</p>
          </div>
        )}
      </article>
    </div>
  );
}

