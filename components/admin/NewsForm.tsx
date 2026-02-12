"use client";

import { useState, useEffect } from "react";
import { generateSlug } from "../../lib/utils";
import { News, NewsBlock } from "./types";
import BlockEditor from "./BlockEditor";
import NewsPreviewBlocks from "./NewsPreviewBlocks";
import NewsPreviewModal from "./NewsPreviewModal";

interface NewsFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  news?: News | null;
}

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

export default function NewsForm({ onSuccess, onCancel, news = null }: NewsFormProps) {
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [pendingBlockImages, setPendingBlockImages] = useState<Record<string, File>>({});
  const [pendingAuthorImages, setPendingAuthorImages] = useState<Record<string, File>>({});
  const [blocks, setBlocks] = useState<NewsBlock[]>(() => {
    // Si hay noticia existente con bloques, usarlos
    if (news?.blocks && news.blocks.length > 0) {
      return news.blocks;
    }
    // Si no hay bloques pero hay datos legacy, crear bloques desde legacy
    if (news) {
      const legacyBlocks: NewsBlock[] = [];
      let order = 1;
      if (news.title) {
        legacyBlocks.push({ type: "title", order: order++, content: news.title });
      }
      if (news.image) {
        legacyBlocks.push({ type: "image", order: order++, imageUrl: news.image });
      }
      if (news.images && news.images.length > 0) {
        // Convertir cada imagen en un bloque de imagen separado
        news.images.forEach((img) => {
          legacyBlocks.push({ type: "image", order: order++, imageUrl: img });
        });
      }
      if (news.content) {
        legacyBlocks.push({ type: "content", order: order++, content: news.content });
      }
      return legacyBlocks.length > 0 ? legacyBlocks : [];
    }
    // Por defecto, sin bloques
    return [];
  });

  // Bloque temporal que se está creando
  const [currentBlock, setCurrentBlock] = useState<NewsBlock | null>(null);

  const getTempId = () => `tmp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const getBlockKey = (block: NewsBlock, index: number) => block.id || `order-${block.order}-${index}`;
  
  const [formData, setFormData] = useState({
    id: news?.id || "",
    title: news?.title || "",
    type: news?.type || "News",
    date: news?.date ? new Date(news.date).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    url: news?.url || "",
    authorId: news?.authorId || null,
  });

  const handleBlockImageFileSelect = (blockKey: string, file: File | null) => {
    setPendingBlockImages((prev) => {
      const next = { ...prev };
      if (!file) {
        delete next[blockKey];
      } else {
        next[blockKey] = file;
      }
      return next;
    });
  };

  const handleAuthorImageFileSelect = (blockKey: string, authorIndex: number, file: File | null) => {
    const key = `${blockKey}-${authorIndex}`;
    setPendingAuthorImages((prev) => {
      const next = { ...prev };
      if (!file) {
        delete next[key];
      } else {
        next[key] = file;
      }
      return next;
    });
  };

  const uploadFile = async (
    file: File,
    folder: "news" | "authors",
    slug: string,
    previousUrl?: string | null
  ) => {
    const imageUploadForm = new FormData();
    imageUploadForm.append("file", file);
    imageUploadForm.append("folder", folder);
    imageUploadForm.append("slug", slug);
    if (previousUrl) {
      imageUploadForm.append("previousUrl", previousUrl);
    }

    const uploadResponse = await fetch("/api/admin/upload", {
      method: "POST",
      body: imageUploadForm,
    });

    if (!uploadResponse.ok) {
      let uploadErrorMessage = "Error uploading image";
      try {
        const uploadErrorData = await uploadResponse.json();
        uploadErrorMessage = uploadErrorData.error || uploadErrorMessage;
      } catch {
        // Keep fallback message if response is not JSON
      }
      throw new Error(uploadErrorMessage);
    }

    const uploadData = await uploadResponse.json();
    if (!uploadData?.path) {
      throw new Error("Upload completed without image URL");
    }

    return uploadData.path as string;
  };

  // Cargar datos de la noticia cuando se pasa como prop
  useEffect(() => {
    if (news) {
      setFormData({
        id: news.id || "",
        title: news.title,
        type: news.type,
        date: new Date(news.date).toISOString().split("T")[0],
        url: news.url || "",
        authorId: news.authorId || null,
      });
      
      // Actualizar bloques
      if (news.blocks && news.blocks.length > 0) {
        setBlocks(news.blocks);
      } else {
        // Migrar desde campos legacy
        const legacyBlocks: NewsBlock[] = [];
        let order = 1;
        if (news.title) {
          legacyBlocks.push({ type: "title", order: order++, content: news.title });
        }
        if (news.image) {
          legacyBlocks.push({ type: "image", order: order++, imageUrl: news.image });
        }
        if (news.images && news.images.length > 0) {
          // Convertir cada imagen en un bloque de imagen separado
          news.images.forEach((img) => {
            legacyBlocks.push({ type: "image", order: order++, imageUrl: img });
          });
        }
        if (news.content) {
          legacyBlocks.push({ type: "content", order: order++, content: news.content });
        }
        setBlocks(legacyBlocks.length > 0 ? legacyBlocks : [{ type: "content", order: 1, content: "" }]);
      }
    }
  }, [news]);

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      url: generateSlug(title),
    });
  };

  const handleBlockDelete = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    // Reordenar
    newBlocks.forEach((block, i) => {
      block.order = i + 1;
    });
    setBlocks(newBlocks);
  };

  const handleBlockMove = (index: number, direction: "up" | "down") => {
    const newBlocks = [...blocks];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    // Actualizar orden
    newBlocks.forEach((block, i) => {
      block.order = i + 1;
    });
    setBlocks(newBlocks);
  };

  const handleSelectBlockType = (type: NewsBlock["type"]) => {
    const newBlock: NewsBlock = {
      id: getTempId(),
      type,
      order: blocks.length + 1,
      content: type === "content" || type === "title" ? "" : null,
      imageUrl: type === "image" ? null : undefined,
      authorId: type === "author" ? null : undefined,
      metadata: type === "author" ? { authors: [{ name: "", image: "", description: "" }] } : undefined,
    };
    setCurrentBlock(newBlock);
  };

  const handleAddBlockToNews = () => {
    if (!currentBlock) return;
    const currentBlockKey = currentBlock.id || "current-block";
    const hasPendingImage = Boolean(pendingBlockImages[currentBlockKey]);

    // Validar que el bloque tenga contenido según su tipo
    if (currentBlock.type === "title" && !currentBlock.content?.trim()) {
      setError("Title cannot be empty");
      return;
    }
    if (currentBlock.type === "image" && !currentBlock.imageUrl && !hasPendingImage) {
      setError("Please upload an image");
      return;
    }
    if (currentBlock.type === "content" && !currentBlock.content?.trim()) {
      setError("Content cannot be empty");
      return;
    }
    if (currentBlock.type === "author") {
      const authors = (currentBlock.metadata?.authors as { name: string; image: string; description: string }[]) || [];
      if (authors.length === 0 || authors.every(a => !a.name.trim())) {
        setError("Please add at least one author with a name");
        return;
      }
    }

    // Agregar el bloque a la lista
    const finalBlockId = currentBlock.id || getTempId();
    const finalBlockKey = finalBlockId;
    const newBlocks = [...blocks, { ...currentBlock, id: finalBlockId, order: blocks.length + 1 }];
    setBlocks(newBlocks);

    if (pendingBlockImages[currentBlockKey] && finalBlockKey !== currentBlockKey) {
      setPendingBlockImages((prev) => {
        const next = { ...prev };
        next[finalBlockKey] = prev[currentBlockKey];
        delete next[currentBlockKey];
        return next;
      });
    }

    if (finalBlockKey !== currentBlockKey) {
      setPendingAuthorImages((prev) => {
        const next = { ...prev };
        const keysToMove = Object.keys(prev).filter((k) => k.startsWith(`${currentBlockKey}-`));
        keysToMove.forEach((oldKey) => {
          const authorIndex = oldKey.replace(`${currentBlockKey}-`, "");
          const newKey = `${finalBlockKey}-${authorIndex}`;
          next[newKey] = prev[oldKey];
          delete next[oldKey];
        });
        return next;
      });
    }

    setCurrentBlock(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    try {
      // Validar campos requeridos
      if (!formData.title || !formData.type) {
        setError("Please fill in title and type");
        setFormLoading(false);
        return;
      }

      if (blocks.length === 0) {
        setError("Please add at least one block");
        setFormLoading(false);
        return;
      }

      const blocksWithUploads: NewsBlock[] = await Promise.all(
        blocks.map(async (block, index) => {
          const blockKey = getBlockKey(block, index);
          const updatedBlock: NewsBlock = { ...block };

          if (block.type === "image" && pendingBlockImages[blockKey]) {
            updatedBlock.imageUrl = await uploadFile(
              pendingBlockImages[blockKey],
              "news",
              `block-${block.id || index}`,
              block.imageUrl || null
            );
          }

          if (block.type === "author" && Array.isArray(updatedBlock.metadata?.authors)) {
            const authors = [...updatedBlock.metadata.authors];
            for (let authorIndex = 0; authorIndex < authors.length; authorIndex++) {
              const pendingKey = `${blockKey}-${authorIndex}`;
              const pendingFile = pendingAuthorImages[pendingKey];
              if (pendingFile) {
                const currentAuthorImage = authors[authorIndex]?.image || null;
                const uploadedAuthorImage = await uploadFile(
                  pendingFile,
                  "authors",
                  `author-${block.id || index}-${authorIndex}`,
                  currentAuthorImage
                );
                authors[authorIndex] = {
                  ...authors[authorIndex],
                  image: uploadedAuthorImage,
                };
              }
            }
            updatedBlock.metadata = {
              ...updatedBlock.metadata,
              authors,
            };
          }

          return updatedBlock;
        })
      );

      const method = formData.id ? "PUT" : "POST";
      const requestBody = {
        id: formData.id || undefined,
        title: formData.title,
        type: formData.type,
        date: formData.date,
        url: formData.url || generateSlug(formData.title),
        authorId: formData.authorId || null,
        blocks: blocksWithUploads.map((block, index) => ({
          id: block.id && !block.id.startsWith("tmp-") ? block.id : undefined,
          type: block.type,
          order: block.order || index + 1,
          content: block.content || null,
          imageUrl: block.imageUrl || null,
          authorId: block.authorId || null,
          metadata: block.metadata || null,
        })),
      };

      const response = await fetch("/api/admin/news", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ News saved successfully:", responseData);
        setPendingBlockImages({});
        setPendingAuthorImages({});
        if (!formData.id) {
          // Limpiar formulario si es nueva noticia
          setFormData({
            id: "",
            title: "",
            type: "News",
            date: new Date().toISOString().split("T")[0],
            url: "",
            authorId: null,
          });
          setBlocks([]);
          setCurrentBlock(null);
        } else {
          // Actualizar estado local si es edición
          setFormData({
            ...formData,
            title: responseData.title,
            type: responseData.type,
            date: new Date(responseData.date).toISOString().split("T")[0],
            url: responseData.url || "",
            authorId: responseData.authorId || null,
          });
          if (responseData.blocks) {
            setBlocks(responseData.blocks);
          }
        }
        onSuccess();
      } else {
        const data = await response.json();
        console.error("❌ Save failed:", data);
        setError(data.error || (formData.id ? "Error updating news" : "Error creating news"));
      }
    } catch (error: unknown) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--admin-text)]">
          {formData.id ? "Edit News Article" : "Add News Article"}
        </h2>
        <button
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        >
          Cancel
        </button>
      </div>

      {/* Layout: 2 columns - Left: Preview, Right: Form */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column - Preview */}
        <div className="lg:sticky lg:top-6 lg:h-fit">
          <div className="mb-4">
            <h3 className="mb-2 text-sm font-medium text-[var(--admin-text)]">News Preview</h3>
            <NewsPreviewBlocks
              newsTitle={formData.title}
              blocks={blocks}
              onDelete={handleBlockDelete}
              onMoveUp={(index) => handleBlockMove(index, "up")}
              onMoveDown={(index) => handleBlockMove(index, "down")}
            />
          </div>
        </div>

        {/* Right Column - Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
            )}

            {/* Title */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                News Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="News article title"
              />
            </div>

            {/* Type, Date - Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Type */}
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                  className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                >
                  {NEWS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                  className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>
            </div>

            {/* Add Blocks Section */}
            <div>
              <label className="mb-2 block text-xs font-medium text-[var(--admin-text)]">
                Add Blocks
              </label>
              <div className="mb-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectBlockType("title")}
                  className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-xs font-medium text-[var(--admin-text)] transition hover:bg-[var(--admin-primary-lighter)]"
                >
                  + Title
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectBlockType("image")}
                  className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-xs font-medium text-[var(--admin-text)] transition hover:bg-[var(--admin-primary-lighter)]"
                >
                  + Image
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectBlockType("content")}
                  className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-xs font-medium text-[var(--admin-text)] transition hover:bg-[var(--admin-primary-lighter)]"
                >
                  + Content
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectBlockType("author")}
                  className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-xs font-medium text-[var(--admin-text)] transition hover:bg-[var(--admin-primary-lighter)]"
                >
                  + Author
                </button>
              </div>

              {/* Editor del bloque temporal */}
              {currentBlock && (
                <div className="rounded-lg border-2 border-primary/30 bg-[var(--admin-surface)] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--admin-text)]">
                      Editing: {currentBlock.type.charAt(0).toUpperCase() + currentBlock.type.slice(1)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCurrentBlock(null)}
                      className="rounded px-2 py-1 text-xs text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)]"
                    >
                      Cancel
                    </button>
                  </div>
                  <BlockEditor
                    block={currentBlock}
                    onUpdate={setCurrentBlock}
                    blockKey={currentBlock.id || "current-block"}
                    onBlockImageFileSelect={handleBlockImageFileSelect}
                    onAuthorImageFileSelect={handleAuthorImageFileSelect}
                    onDelete={() => setCurrentBlock(null)}
                    onMoveUp={() => {}}
                    onMoveDown={() => {}}
                    canMoveUp={false}
                    canMoveDown={false}
                  />
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleAddBlockToNews}
                      className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
                    >
                      Add Block to News
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* URL (auto-generated, editable) */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">URL Slug</label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="url-slug"
              />
              <p className="mt-1 text-xs text-[var(--admin-text-muted)]">Auto-generated from title, but you can edit it</p>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-[var(--admin-border)] pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
              >
                Preview
              </button>
              <button
                type="submit"
                disabled={formLoading}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50"
              >
                {formLoading ? "Saving..." : formData.id ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview Modal */}
      <NewsPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={formData.title}
        type={formData.type}
        date={formData.date}
        blocks={blocks}
      />
    </div>
  );
}

