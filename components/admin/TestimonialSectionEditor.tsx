"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorToolbar } from "./EditorToolbar";

const EDITOR_EXTENSIONS = [
  StarterKit,
  TextStyle,
  Color,
  Underline,
  Link.configure({ openOnClick: false }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
];

interface TestimonialSectionEditorProps {
  value: string;
  onChange: (html: string) => void;
  sectionKey: string;
}

export function TestimonialSectionEditor({
  value,
  onChange,
  sectionKey,
}: TestimonialSectionEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: EDITOR_EXTENSIONS,
    content: value?.startsWith("<") ? value : value ? `<p>${value}</p>` : "<p></p>",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <div className="rounded-lg border border-[var(--admin-border)] overflow-hidden bg-background">
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="[&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:text-sm [&_.ProseMirror]:outline-none"
      />
    </div>
  );
}
