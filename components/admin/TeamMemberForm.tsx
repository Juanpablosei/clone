"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorToolbar } from "./EditorToolbar";
import ImageUpload from "./ImageUpload";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: string;
  image: string;
  description: string | null;
  slug: string;
  linkedin?: string | null;
  x?: string | null;
  url?: string | null;
}

interface TeamMemberFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  member?: TeamMember | null;
}

export default function TeamMemberForm({
  onSuccess,
  onCancel,
  member = null,
}: TeamMemberFormProps) {
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    id: member?.id || "",
    name: member?.name || "",
    role: member?.role || "",
    type: member?.type || "OUR_TEAM",
    image: member?.image || "",
    description: member?.description || "",
    slug: member?.slug || "",
    linkedin: member?.linkedin || "",
    x: member?.x || "",
    url: member?.url || "",
  });
  const [originalImage, setOriginalImage] = useState<string | null>(member?.image || null);

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
    content: formData.description || "",
    onUpdate: ({ editor: editorInstance }) => {
      const html = editorInstance.getHTML();
      setFormData((prev) => ({ ...prev, description: html }));
    },
  });

  // Cargar datos del miembro cuando se pasa como prop
  useEffect(() => {
    if (member) {
      setFormData({
        id: member.id,
        name: member.name,
        role: member.role,
        type: member.type || "OUR_TEAM",
        image: member.image,
        description: member.description || "",
        slug: member.slug,
        linkedin: member.linkedin || "",
        x: member.x || "",
        url: member.url || "",
      });
      setOriginalImage(member.image);
      if (editor) {
        editor.commands.setContent(member.description || "");
      }
    } else {
      setOriginalImage(null);
    }
  }, [member, editor]);

  // Sincronizar el contenido del editor cuando se limpia el formulario
  useEffect(() => {
    if (editor && formData.description === "" && !member) {
      editor.commands.clearContent();
    }
  }, [editor, formData.description, member]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleImageChange = (imageUrl: string | null) => {
    setFormData((prev) => ({ ...prev, image: imageUrl || "" }));
  };

  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    // Si se elimina el archivo, también limpiar la URL
    if (!file) {
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    try {
      let imagePath = formData.image;

      // Si hay un archivo nuevo, subirlo primero
      if (imageFile) {
        console.log("📤 Uploading new image file...");
        const formDataUpload = new FormData();
        formDataUpload.append("file", imageFile);
        formDataUpload.append("folder", "team");
        formDataUpload.append("slug", formData.slug || generateSlug(formData.name));

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          if (uploadData.path) {
            imagePath = uploadData.path;
            console.log("✅ Image uploaded successfully:", uploadData.path);
          } else {
            console.error("❌ No path in upload response:", uploadData);
            setError("Error: No image path returned from upload");
            setFormLoading(false);
            return;
          }
        } else {
          const errorData = await uploadResponse.json().catch(() => ({}));
          console.error("❌ Upload failed:", errorData);
          setError(errorData.error || "Error uploading image. Please try again.");
          setFormLoading(false);
          return;
        }
      }

      // Validar que haya una imagen
      if (!imagePath) {
        if (formData.id) {
          setError("Image is required. Please select an image and try again.");
        } else {
          setError("Image is required");
        }
        setFormLoading(false);
        return;
      }

      console.log("✅ Image path ready:", imagePath);

      const method = formData.id ? "PUT" : "POST";
      const requestBody = {
        ...formData,
        image: imagePath,
        originalImage: formData.id ? originalImage : null, // Solo enviar si es edición
      };

      console.log("📤 Sending request:", {
        method,
        id: formData.id,
        image: formData.image,
        originalImage: formData.id ? originalImage : null,
      });

      const response = await fetch("/api/admin/team", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ Team member saved successfully:", responseData);
        if (!formData.id) {
          // Solo limpiar si es un nuevo miembro
          setFormData({
            id: "",
            name: "",
            role: "",
            type: "OUR_TEAM",
            image: "",
            description: "",
            slug: "",
            linkedin: "",
            x: "",
            url: "",
          });
          editor?.commands.clearContent();
          setImageFile(null);
        } else {
          // Si es una actualización, actualizar el estado local con los nuevos datos
          setFormData({
            ...formData,
            name: responseData.name,
            role: responseData.role,
            type: responseData.type || "OUR_TEAM",
            image: responseData.image,
            description: responseData.description || "",
            slug: responseData.slug,
            linkedin: responseData.linkedin || "",
            x: responseData.x || "",
            url: responseData.url || "",
          });
          setOriginalImage(responseData.image);
          if (editor) {
            editor.commands.setContent(responseData.description || "");
          }
        }
        // Llamar a onSuccess para refrescar la lista de miembros
        onSuccess();
      } else {
        const data = await response.json();
        console.error("❌ Save failed:", data);
        setError(data.error || (formData.id ? "Error updating team member" : "Error creating team member"));
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--admin-text)]">
          {formData.id ? "Edit Team Member" : "Add Team Member"}
        </h2>
        <button
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Layout: 2 columns - Left: Photo/Name/Role, Right: Description (2/3) */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column - Photo, Name, Role (1/3) */}
          <div className="space-y-3">
            {/* Photo */}
            <ImageUpload
              value={formData.image || null}
              onChange={handleImageChange}
              onFileSelect={handleFileSelect}
              folder="team"
              slug={formData.slug || generateSlug(formData.name)}
              label="Photo"
              required={!formData.id}
              error={error}
              previewSize="md"
              shape="circle"
              autoUpload={false}
            />

            {/* Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="John Doe"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                Role <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                required
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="Chief Executive"
              />
            </div>

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
                <option value="OUR_TEAM">Our team</option>
                <option value="FELLOWS">Fellows</option>
                <option value="BOARD">Board</option>
                <option value="ADVISORY_BOARD">Advisory Board</option>
                <option value="RESEARCH_STUDENT_AFFILIATES">Research Student Affiliates</option>
              </select>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                LinkedIn
              </label>
              <input
                type="url"
                value={formData.linkedin}
                onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            {/* X (Twitter) */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                X (Twitter)
              </label>
              <input
                type="url"
                value={formData.x}
                onChange={(e) => setFormData({ ...formData, x: e.target.value })}
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="https://x.com/username"
              />
            </div>

            {/* URL */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                URL
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="https://example.com"
              />
            </div>
          </div>

          {/* Right Column - Description (2/3) */}
          <div className="lg:col-span-2">
            <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
              Description
            </label>
            <div className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
              {editor && <EditorToolbar editor={editor} />}
              <EditorContent
                editor={editor}
                className="[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:text-sm [&_.ProseMirror]:text-[var(--admin-text)] [&_.ProseMirror]:outline-none [&_.ProseMirror]:prose [&_.ProseMirror]:prose-sm [&_.ProseMirror]:max-w-none"
              />
            </div>
          </div>
        </div>

        {/* Slug - Hidden or optional */}
        <div className="hidden">
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)]"
            placeholder="john-doe"
          />
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
            type="submit"
            disabled={formLoading}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50"
          >
            {formLoading
              ? formData.id
                ? "Updating..."
                : "Creating..."
              : formData.id
                ? "Update"
                : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

