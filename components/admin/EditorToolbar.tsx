"use client";

import { Editor } from "@tiptap/react";

interface EditorToolbarProps {
  editor: Editor;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] p-2">
      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`rounded px-2 py-1 text-xs font-medium transition ${
          editor.isActive("heading", { level: 1 })
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        H1
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`rounded px-2 py-1 text-xs font-medium transition ${
          editor.isActive("heading", { level: 2 })
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        H2
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`rounded px-2 py-1 text-xs font-medium transition ${
          editor.isActive("heading", { level: 3 })
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        H3
      </button>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Text Styles */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`rounded px-2 py-1 text-xs font-bold transition ${
          editor.isActive("bold")
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        B
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`rounded px-2 py-1 text-xs italic transition ${
          editor.isActive("italic")
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        I
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`rounded px-2 py-1 text-xs underline transition ${
          editor.isActive("underline")
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        U
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`rounded px-2 py-1 text-xs line-through transition ${
          editor.isActive("strike")
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        S
      </button>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Lists */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`rounded px-2 py-1 text-xs transition ${
          editor.isActive("bulletList")
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        •
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`rounded px-2 py-1 text-xs transition ${
          editor.isActive("orderedList")
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        1.
      </button>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Align */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={`rounded px-2 py-1 text-xs transition ${
          editor.isActive({ textAlign: "left" })
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        ←
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={`rounded px-2 py-1 text-xs transition ${
          editor.isActive({ textAlign: "center" })
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        ↔
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={`rounded px-2 py-1 text-xs transition ${
          editor.isActive({ textAlign: "right" })
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        →
      </button>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Link */}
      <button
        type="button"
        onClick={() => {
          const url = window.prompt("Enter URL:");
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={`rounded px-2 py-1 text-xs transition ${
          editor.isActive("link")
            ? "bg-primary text-white"
            : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        }`}
      >
        🔗
      </button>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Color */}
      <input
        type="color"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="h-6 w-8 cursor-pointer rounded border border-border"
        title="Text Color"
      />

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Clear */}
      <button
        type="button"
        onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
        className="rounded px-2 py-1 text-xs text-muted transition hover:bg-background hover:text-foreground"
      >
        Clear
      </button>
    </div>
  );
}

