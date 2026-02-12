"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  tags: string[];
  image?: string | null;
  requireEmail: boolean;
}

interface ResourceFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  resource?: Resource | null;
}

export default function ResourceForm({
  onSuccess,
  onCancel,
  resource = null,
}: ResourceFormProps) {
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    id: resource?.id || "",
    title: resource?.title || "",
    description: resource?.description || "",
    fileUrl: resource?.fileUrl || "",
    fileType: resource?.fileType || "PDF",
    tags: resource?.tags || [] as string[],
    image: resource?.image || "",
    requireEmail: resource?.requireEmail || false,
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (resource) {
      setFormData({
        id: resource.id,
        title: resource.title,
        description: resource.description,
        fileUrl: resource.fileUrl,
        fileType: resource.fileType,
        tags: resource.tags,
        image: resource.image || "",
        requireEmail: resource.requireEmail,
      });
    }
  }, [resource]);

  const handleDocumentFileSelect = (file: File | null) => {
    setDocumentFile(file);
    if (!file) {
      setFormData((prev) => ({ ...prev, fileUrl: "" }));
    }
  };

  const handleDocumentChange = (fileUrl: string | null) => {
    setFormData((prev) => ({ ...prev, fileUrl: fileUrl || "" }));
  };

  const handleImageFileSelect = (file: File | null) => {
    setImageFile(file);
    if (!file) {
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    try {
      let fileUrl = formData.fileUrl;
      let imageUrl = formData.image;

      // Si hay un archivo nuevo (documento), subirlo primero
      if (documentFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", documentFile);
        formDataUpload.append("folder", "resources");
        // Para documentos, usar el nombre del archivo como slug base
        const fileNameWithoutExt = documentFile.name.replace(/\.[^/.]+$/, "");
        formDataUpload.append("slug", fileNameWithoutExt);

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (uploadResponse.ok) {
          const uploadData = await uploadResponse.json();
          if (uploadData.path) {
            fileUrl = uploadData.path;
          } else {
            setError("Error: No file URL returned from upload");
            setFormLoading(false);
            return;
          }
        } else {
          const errorData = await uploadResponse.json().catch(() => ({ error: "Unknown error" }));
          setError(errorData.error || "Error uploading file. Please try again.");
          setFormLoading(false);
          return;
        }
      }

      // Si hay una imagen nueva, subirla al guardar (no auto-upload)
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("file", imageFile);
        imageFormData.append("folder", "resources");
        imageFormData.append(
          "slug",
          formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")
        );
        if (formData.image) {
          imageFormData.append("previousUrl", formData.image);
        }

        const imageUploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: imageFormData,
        });

        if (imageUploadResponse.ok) {
          const imageUploadData = await imageUploadResponse.json();
          if (imageUploadData.path) {
            imageUrl = imageUploadData.path;
          } else {
            setError("Error: No image URL returned from upload");
            setFormLoading(false);
            return;
          }
        } else {
          const errorData = await imageUploadResponse
            .json()
            .catch(() => ({ error: "Unknown error" }));
          setError(errorData.error || "Error uploading image. Please try again.");
          setFormLoading(false);
          return;
        }
      }

      // Validar que haya una URL de archivo
      if (!fileUrl) {
        setError("File is required. Please upload a file.");
        setFormLoading(false);
        return;
      }

      const method = formData.id ? "PUT" : "POST";
      const response = await fetch("/api/admin/resources", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fileUrl,
          image: imageUrl,
        }),
      });

      if (response.ok) {
        onSuccess();
        if (!formData.id) {
          setFormData({
            id: "",
            title: "",
            description: "",
            fileUrl: "",
            fileType: "PDF",
            tags: [],
            image: "",
            requireEmail: false,
          });
          setDocumentFile(null);
          setImageFile(null);
        } else {
          setImageFile(null);
          setFormData((prev) => ({ ...prev, fileUrl, image: imageUrl || "" }));
        }
      } else {
        const data = await response.json();
        setError(data.error || (formData.id ? "Error updating resource" : "Error creating resource"));
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
          {formData.id ? "Edit Resource" : "Add Resource"}
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

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            placeholder="AI Governance Framework"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={4}
            className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            placeholder="A comprehensive guide for implementing AI governance..."
          />
        </div>

        <div>
          <ImageUpload
            value={formData.fileUrl || null}
            onChange={handleDocumentChange}
            onFileSelect={handleDocumentFileSelect}
            folder="resources"
            slug={formData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")}
            label="Document (PDF, Word, Excel)"
            required={!formData.id}
            error={error}
            autoUpload={false}
            previewSize="lg"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
            File Type <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.fileType}
            onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
            required
            className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            placeholder="PDF, Tool, Resource Pack, etc."
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
            Tags
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag();
                }
              }}
              className="flex-1 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              placeholder="Add a tag and press Enter"
            />
            <button
              type="button"
              onClick={addTag}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
            >
              Add
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-primary-strong"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
            Image
          </label>
          <ImageUpload
            value={formData.image || null}
            onChange={(url) => setFormData({ ...formData, image: url || "" })}
            onFileSelect={handleImageFileSelect}
            folder="resources"
            slug={formData.title.toLowerCase().replace(/\s+/g, "-")}
            label=""
            autoUpload={false}
            previewSize="md"
          />
        </div>

        <div>
          <label className="mb-1 flex items-center gap-2 text-xs font-medium text-[var(--admin-text)]">
            <input
              type="checkbox"
              checked={formData.requireEmail}
              onChange={(e) => setFormData({ ...formData, requireEmail: e.target.checked })}
              className="rounded border-[var(--admin-border)] text-primary focus:ring-primary"
            />
            Require email to download
          </label>
        </div>


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

