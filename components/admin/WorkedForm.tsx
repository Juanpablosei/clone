"use client";

import { useState, useEffect } from "react";
import ImageUpload from "./ImageUpload";

interface Worked {
  id: string;
  name: string;
  image: string;
  url: string | null;
  description: string | null;
}

interface WorkedFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  worked?: Worked | null;
}

export default function WorkedForm({
  onSuccess,
  onCancel,
  worked = null,
}: WorkedFormProps) {
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    id: worked?.id || "",
    name: worked?.name || "",
    image: worked?.image || "",
    url: worked?.url || "",
    description: worked?.description || "",
  });
  const [originalImage, setOriginalImage] = useState<string | null>(worked?.image || null);

  // Cargar datos del worked cuando se pasa como prop
  useEffect(() => {
    if (worked) {
      setFormData({
        id: worked.id,
        name: worked.name,
        image: worked.image,
        url: worked.url || "",
        description: worked.description || "",
      });
      setOriginalImage(worked.image);
    } else {
      setOriginalImage(null);
    }
  }, [worked]);

  // Callback para cuando ImageUpload selecciona un archivo (no lo sube aún)
  const handleFileSelect = (file: File | null) => {
    setImageFile(file);
    if (!file) {
      setFormData((prev) => ({ ...prev, image: "" }));
    }
  };

  // Callback para cuando ImageUpload actualiza la URL (solo si autoUpload está activo)
  const handleImageChange = (imageUrl: string | null) => {
    setFormData((prev) => ({ ...prev, image: imageUrl || "" }));
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
        formDataUpload.append("folder", "worked");
        formDataUpload.append("slug", formData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-"));

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
        setError("Image is required. Please select an image.");
        setFormLoading(false);
        return;
      }

      const method = formData.id ? "PUT" : "POST";
      const requestBody = {
        ...formData,
        image: imagePath,
        originalImage: formData.id ? originalImage : null,
      };

      console.log("📤 Sending request:", {
        method,
        id: formData.id,
        image: imagePath,
        originalImage: formData.id ? originalImage : null,
      });

      const response = await fetch("/api/admin/worked", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log("✅ Worked saved successfully:", responseData);
        if (!formData.id) {
          // Solo limpiar si es un nuevo worked
          setFormData({
            id: "",
            name: "",
            image: "",
            url: "",
            description: "",
          });
          setImageFile(null);
        } else {
          // Si es una actualización, actualizar el estado local con los nuevos datos
          setFormData({
            ...formData,
            name: responseData.name,
            image: responseData.image,
            url: responseData.url || "",
            description: responseData.description || "",
          });
          setOriginalImage(responseData.image);
        }
        onSuccess();
      } else {
        const data = await response.json();
        console.error("❌ Save failed:", data);
        setError(data.error || (formData.id ? "Error updating worked" : "Error creating worked"));
      }
    } catch (err: any) {
      console.error("❌ An unexpected error occurred:", err);
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[var(--admin-text)]">
          {formData.id ? "Edit Worked" : "Add Worked"}
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

        {/* Layout: 2 columns - Left: Image, Right: Form fields */}
        <div className="grid gap-4 lg:grid-cols-3">
          {/* Left Column - Image (1/3) */}
          <div className="space-y-3">
            <ImageUpload
              id="worked-main-image"
              value={formData.image || null}
              onChange={handleImageChange}
              onFileSelect={handleFileSelect}
              folder="worked"
              slug={formData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-")}
              label="Logo"
              required={!formData.id}
              error={error}
              previewSize="md"
              shape="square"
              autoUpload={false}
            />
          </div>

          {/* Right Column - Form fields (2/3) */}
          <div className="lg:col-span-2 space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="Worked Name"
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

            {/* Description */}
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--admin-text)]">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                placeholder="Worked description..."
              />
            </div>
          </div>
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
            {formLoading ? "Saving..." : formData.id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

