"use client";

import { useState } from "react";
import { NewsBlock, AuthorInfo } from "./types";
import ImageUpload from "./ImageUpload";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorToolbar } from "./EditorToolbar";
import Image from "next/image";

interface BlockEditorProps {
  block: NewsBlock;
  onUpdate: (block: NewsBlock) => void;
  blockKey?: string;
  onBlockImageFileSelect?: (blockKey: string, file: File | null) => void;
  onAuthorImageFileSelect?: (blockKey: string, authorIndex: number, file: File | null) => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}

const BLOCK_TYPES = [
  { value: "title", label: "Title" },
  { value: "image", label: "Image" },
  { value: "content", label: "Content" },
  { value: "author", label: "Author" },
] as const;

export default function BlockEditor({
  block,
  onUpdate,
  blockKey,
  onBlockImageFileSelect,
  onAuthorImageFileSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: BlockEditorProps) {
  const [localBlock, setLocalBlock] = useState<NewsBlock>(block);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: block.type === "content" ? (block.content || "") : "",
    onUpdate: ({ editor: editorInstance }) => {
      if (block.type === "content") {
        const html = editorInstance.getHTML();
        const updated = { ...localBlock, content: html };
        setLocalBlock(updated);
        onUpdate(updated);
      }
    },
  });

  const handleTypeChange = (newType: NewsBlock["type"]) => {
    const updated = { ...localBlock, type: newType };
    setLocalBlock(updated);
    onUpdate(updated);
  };

  const handleContentChange = (content: string) => {
    const updated = { ...localBlock, content };
    setLocalBlock(updated);
    onUpdate(updated);
  };

  const handleImageChange = (imageUrl: string | null) => {
    const updated = { ...localBlock, imageUrl: imageUrl || null };
    setLocalBlock(updated);
    onUpdate(updated);
  };

  return (
    <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <select
            value={localBlock.type}
            onChange={(e) => handleTypeChange(e.target.value as NewsBlock["type"])}
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-2 py-1 text-xs font-medium text-[var(--admin-text)]"
          >
            {BLOCK_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <span className="text-xs text-[var(--admin-text-muted)]">Order: {localBlock.order}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="rounded px-2 py-1 text-xs text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)] disabled:opacity-50"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="rounded px-2 py-1 text-xs text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)] disabled:opacity-50"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded px-2 py-1 text-xs text-red-500 transition hover:bg-red-50"
            title="Delete block"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Renderizar contenido según el tipo */}
      {localBlock.type === "title" && (
        <input
          type="text"
          value={localBlock.content || ""}
          onChange={(e) => handleContentChange(e.target.value)}
          className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-lg font-semibold text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
          placeholder="Title text..."
        />
      )}

      {localBlock.type === "image" && (
        <div>
          <ImageUpload
            value={localBlock.imageUrl || null}
            onChange={handleImageChange}
            onFileSelect={(file) => {
              if (file) {
                handleImageChange(URL.createObjectURL(file));
              }
              if (!blockKey || !onBlockImageFileSelect) return;
              onBlockImageFileSelect(blockKey, file);
            }}
            folder="news"
            slug={`block-${localBlock.id || Date.now()}`}
            label="Image"
            required={false}
            previewSize="md"
            shape="square"
            autoUpload={false}
          />
        </div>
      )}

      {localBlock.type === "author" && (
        <div className="space-y-4">
          {(() => {
            const authors: AuthorInfo[] = (localBlock.metadata?.authors as AuthorInfo[]) || [];
            
            const updateAuthors = (newAuthors: AuthorInfo[]) => {
              const updated = {
                ...localBlock,
                metadata: {
                  ...localBlock.metadata,
                  authors: newAuthors,
                },
              };
              setLocalBlock(updated);
              onUpdate(updated);
            };

            const addAuthor = () => {
              updateAuthors([
                ...authors,
                { name: "", image: "", description: "" },
              ]);
            };

            const removeAuthor = (index: number) => {
              updateAuthors(authors.filter((_, i) => i !== index));
            };

            const updateAuthor = (index: number, field: keyof AuthorInfo, value: string) => {
              const newAuthors = [...authors];
              newAuthors[index] = { ...newAuthors[index], [field]: value };
              updateAuthors(newAuthors);
            };

            return (
              <>
                {authors.map((author, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface-secondary)] p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-[var(--admin-text)]">
                        Author {index + 1}
                      </h4>
                      {authors.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeAuthor(index)}
                          className="rounded px-2 py-1 text-xs text-red-500 transition hover:bg-red-50"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="space-y-3">
                      {/* Nombre */}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                          Name *
                        </label>
                        <input
                          type="text"
                          value={author.name}
                          onChange={(e) => updateAuthor(index, "name", e.target.value)}
                          className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                          placeholder="Author name"
                        />
                      </div>

                      {/* Imagen */}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                          Image
                        </label>
                        <ImageUpload
                          value={author.image || null}
                          onChange={(imageUrl) => updateAuthor(index, "image", imageUrl || "")}
                          onFileSelect={(file) => {
                            if (file) {
                              updateAuthor(index, "image", URL.createObjectURL(file));
                            }
                            if (!blockKey || !onAuthorImageFileSelect) return;
                            onAuthorImageFileSelect(blockKey, index, file);
                          }}
                          folder="authors"
                          slug={`author-${localBlock.id || Date.now()}-${index}`}
                          label=""
                          required={false}
                          previewSize="sm"
                          shape="circle"
                          autoUpload={false}
                        />
                      </div>

                      {/* Descripción */}
                      <div>
                        <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                          Description
                        </label>
                        <textarea
                          value={author.description}
                          onChange={(e) => updateAuthor(index, "description", e.target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                          placeholder="Author description"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Botón para agregar más autores */}
                <button
                  type="button"
                  onClick={addAuthor}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-3 text-sm font-medium text-[var(--admin-text-muted)] transition hover:border-primary hover:text-primary"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Author
                </button>

                {authors.length === 0 && (
                  <p className="text-center text-xs text-[var(--admin-text-muted)]">
                    Click "Add Author" to add authors to this block
                  </p>
                )}
              </>
            );
          })()}
        </div>
      )}

      {localBlock.type === "content" && editor && (
        <div>
          <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
            <EditorToolbar editor={editor} />
            <EditorContent
              editor={editor}
              className="[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:text-sm [&_.ProseMirror]:text-[var(--admin-text)] [&_.ProseMirror]:outline-none [&_.ProseMirror]:prose [&_.ProseMirror]:prose-sm [&_.ProseMirror]:max-w-none"
            />
          </div>
        </div>
      )}

    </div>
  );
}

