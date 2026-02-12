"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

// Placeholder para cuando la imagen falla
const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128' viewBox='0 0 128 128'%3E%3Crect fill='%23e5e7eb' width='128' height='128'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='48' fill='%239ca3af'%3E?%3C/text%3E%3C/svg%3E";

export type ImageUploadFolder = "team" | "news" | "partners" | "worked" | "config" | "authors" | "about-us" | "home" | "resources";

interface ImageUploadProps {
  value: string | null; // URL de la imagen actual
  onChange: (imageUrl: string | null) => void; // Callback cuando cambia la imagen
  onFileSelect?: (file: File | null) => void; // Callback cuando se selecciona un archivo (para subir manualmente)
  onUpload?: (imageUrl: string) => void; // Callback cuando se completa la subida
  folder: ImageUploadFolder; // Folder en Cloudinary
  slug?: string; // Slug para generar el public_id único
  label?: string; // Label del campo
  required?: boolean; // Si es requerido
  error?: string; // Mensaje de error
  previewSize?: "sm" | "md" | "lg" | "xl" | "banner"; // Tamaño del preview
  shape?: "square" | "circle" | "rect"; // Forma del preview
  className?: string; // Clases adicionales
  autoUpload?: boolean; // Si sube automáticamente (default: false)
  id?: string; // ID único para el input (opcional, se genera automáticamente si no se proporciona)
}

export default function ImageUpload({
  value,
  onChange,
  onFileSelect,
  onUpload,
  folder,
  slug,
  label = "Image",
  required = false,
  error,
  previewSize = "md",
  shape = "square",
  className = "",
  autoUpload = false,
  id,
}: ImageUploadProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(value || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDocument, setIsDocument] = useState(false);
  const [documentName, setDocumentName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generar un ID único para este componente
  const inputId = id || `image-upload-${folder}-${slug || Date.now()}`;

  // Sincronizar preview cuando cambia el value (solo si no hay un archivo seleccionado)
  useEffect(() => {
    if (!imageFile) {
      setImagePreview(value || null);
      // Detectar si el value es un documento (si tiene extensión de documento pero no es una imagen)
      if (value && !value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        setIsDocument(true);
        const urlParts = value.split("/");
        const fileName = urlParts[urlParts.length - 1]?.split("?")[0] || null;
        setDocumentName(fileName);
      } else {
        setIsDocument(false);
        setDocumentName(null);
      }
    }
  }, [value, imageFile]);

  // Tamaños del preview
  const sizeClasses = {
    sm: "h-20 w-20",
    md: "h-28 w-28",
    lg: "h-40 w-40",
    xl: "h-56 w-56",
    banner: "h-28 w-full sm:h-36 md:h-44 lg:h-52 xl:h-60", // ancho completo
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo (imágenes o documentos)
    const fileIsImage = file.type.startsWith("image/");
    const fileIsDocument = 
      file.type === "application/pdf" ||
      file.type === "application/msword" ||
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.type === "application/vnd.ms-excel" ||
      file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    if (!fileIsImage && !fileIsDocument) {
      setUploadError("El archivo debe ser una imagen o documento (PDF, Word, Excel)");
      return;
    }

    // Validar tamaño (20MB para documentos, 10MB para imágenes)
    const maxSize = fileIsDocument ? 20 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError(`El archivo debe ser menor a ${fileIsDocument ? '20MB' : '10MB'}`);
      return;
    }

    setUploadError(null);
    setImageFile(file);
    setIsDocument(fileIsDocument);

    // Crear preview local (solo para imágenes)
    if (fileIsImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setDocumentName(null);
    } else {
      // Para documentos, guardar el nombre del archivo
      setImagePreview(null);
      setDocumentName(file.name);
    }

    // Notificar al padre que se seleccionó un archivo
    if (onFileSelect) {
      onFileSelect(file);
    }

    // Subir automáticamente solo si autoUpload está habilitado
    if (autoUpload) {
      await uploadImage(file);
    }
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("folder", folder);
      if (slug) {
        formDataUpload.append("slug", slug);
      }
      if (value) {
        formDataUpload.append("previousUrl", value);
      }

      let uploadResponse: Response;
      try {
        uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formDataUpload,
        });
      } catch (networkError) {
        // Error de red (sin conexión, timeout, etc.)
        const networkErrorMessage = networkError instanceof Error 
          ? networkError.message 
          : "Network error. Please check your connection and try again.";
        throw new Error(networkErrorMessage);
      }

      if (uploadResponse.ok) {
        let uploadData;
        try {
          uploadData = await uploadResponse.json();
        } catch (jsonError) {
          throw new Error("Invalid response from server. Please try again.");
        }

        if (uploadData?.path) {
          const fileUrl = uploadData.path;
          // Si es una imagen, mostrar preview; si es documento, solo guardar URL
          if (file.type.startsWith("image/")) {
            setImagePreview(fileUrl);
          } else {
            setDocumentName(file.name);
            setImagePreview(fileUrl); // Guardar URL para poder mostrar que está subido
          }
          // Solo llamar onChange si autoUpload está activo (para imágenes adicionales)
          // Si no está activo, el onChange se llamará desde el formulario después del submit
          if (autoUpload) {
            onChange(fileUrl);
            if (onUpload) {
              onUpload(fileUrl);
            }
          }
          setImageFile(null);
        } else {
          throw new Error("No file path returned from upload");
        }
      } else {
        // Intentar leer el error de la respuesta
        let errorMessage = `Error uploading image (Status: ${uploadResponse.status})`;
        try {
          const contentType = uploadResponse.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await uploadResponse.json();
            errorMessage = errorData.error || errorData.message || errorMessage;
          } else {
            const textError = await uploadResponse.text();
            if (textError && textError.trim()) {
              errorMessage = textError;
            }
          }
        } catch (parseError) {
          // Si no se puede parsear, usar el mensaje por defecto con el status
          console.error("Error parsing error response:", parseError);
          errorMessage = `Error uploading image (Status: ${uploadResponse.status}). Please try again.`;
        }
        throw new Error(errorMessage);
      }
    } catch (err: unknown) {
      console.error("Error uploading image:", err);
      let errorMessage = "Error uploading image";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }
      
      setUploadError(errorMessage);
      setImagePreview(value || null);
      setImageFile(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setImagePreview(null);
    setImageFile(null);
    setIsDocument(false);
    setDocumentName(null);
    onChange(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sizeClass = sizeClasses[previewSize];
  const shapeClass =
    shape === "circle"
      ? "rounded-full"
      : shape === "rect"
      ? "rounded-lg"
      : "rounded-lg";

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-medium text-[var(--admin-text)]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

        <div className="flex items-center justify-center">
        {/* Preview de la imagen o documento */}
        {imagePreview || documentName ? (
            <div className="relative w-full">
            <label htmlFor={inputId} className="cursor-pointer">
              <div
                  className={`relative ${sizeClass} ${shapeClass} overflow-hidden border-2 border-primary/30 transition hover:border-primary/50 bg-muted/20 ${
                    isDocument ? "flex items-center justify-center p-4" : ""
                  }`}
              >
                {uploading ? (
                  <div className="flex h-full w-full items-center justify-center bg-black/20">
                    <svg
                      className="h-6 w-6 animate-spin text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </div>
                ) : isDocument ? (
                  <div className="flex flex-col items-center justify-center text-center">
                    <svg className="h-12 w-12 text-primary mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-xs text-[var(--admin-text)] font-medium truncate max-w-full px-2">
                      {documentName || "Documento"}
                    </p>
                  </div>
                ) : (
                  <Image
                    src={imagePreview || PLACEHOLDER_IMAGE}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                )}
                {/* Remove button intentionally hidden */}
              </div>
            </label>
          </div>
        ) : (
          <label htmlFor={inputId} className="cursor-pointer">
            <div
              className={`${sizeClass} ${shapeClass} flex items-center justify-center border-2 border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] transition hover:border-primary/50 hover:bg-surface`}
            >
              {uploading ? (
                <svg
                  className="h-6 w-6 animate-spin text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                <svg className="h-8 w-8 text-[var(--admin-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              )}
            </div>
          </label>
        )}

        {/* Input file oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf,.pdf,.doc,.docx,.xls,.xlsx"
          onChange={handleImageChange}
          required={required && !imagePreview && !documentName}
          className="hidden"
          id={inputId}
          disabled={uploading}
        />
      </div>

      {/* Mensajes de error */}
      {(error || uploadError) && (
        <p className="text-xs text-red-600">{error || uploadError}</p>
      )}

      {/* Info */}
      {!error && !uploadError && (
        <p className="text-xs text-[var(--admin-text-muted)]">
          {uploading 
            ? (isDocument ? "Uploading document..." : "Uploading image...") 
            : (isDocument ? "Click to select a document" : "Click to select an image")}
        </p>
      )}
    </div>
  );
}

