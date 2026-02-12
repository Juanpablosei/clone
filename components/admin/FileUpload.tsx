"use client";

import { useState, useRef, useEffect } from "react";

export type FileUploadFolder = "resources";

interface FileUploadProps {
  value: string | null; // URL del archivo actual
  onChange: (fileUrl: string | null) => void; // Callback cuando cambia el archivo
  onFileSelect?: (file: File | null) => void; // Callback cuando se selecciona un archivo (para subir manualmente)
  folder: FileUploadFolder; // Folder en Cloudinary
  slug?: string; // Slug para generar el public_id único
  label?: string; // Label del campo
  required?: boolean; // Si es requerido
  error?: string; // Mensaje de error
  className?: string; // Clases adicionales
  autoUpload?: boolean; // Si sube automáticamente (default: false)
  id?: string; // ID único para el input
  acceptedTypes?: string; // Tipos de archivo aceptados (default: "application/pdf,.pdf")
}

export default function FileUpload({
  value,
  onChange,
  onFileSelect,
  folder,
  slug,
  label = "File",
  required = false,
  error,
  className = "",
  autoUpload = false,
  id,
  acceptedTypes = "application/pdf,.pdf,.doc,.docx,.xls,.xlsx",
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Generar un ID único para este componente
  const inputId = id || `file-upload-${folder}-${slug || Date.now()}`;

  const getFileName = (url: string | null) => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      return pathParts[pathParts.length - 1];
    } catch {
      return url.split("/").pop() || null;
    }
  };

  const fileName = getFileName(value);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validar tipo de archivo
    const validTypes = acceptedTypes.split(",").map(t => t.trim());
    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    const isValidType = validTypes.some(type => 
      selectedFile.type === type || 
      type.startsWith(".") && fileExtension === type.substring(1) ||
      type === selectedFile.type
    );

    if (!isValidType) {
      setUploadError(`File must be one of: ${acceptedTypes}`);
      return;
    }

    // Validar tamaño (20MB para documentos)
    if (selectedFile.size > 20 * 1024 * 1024) {
      setUploadError("File size must be less than 20MB");
      return;
    }

    setUploadError(null);
    setFile(selectedFile);

    // Notificar al padre que se seleccionó un archivo
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }

    // Subir automáticamente solo si autoUpload está habilitado
    if (autoUpload) {
      await uploadFile(selectedFile);
    }
  };

  const uploadFile = async (fileToUpload: File) => {
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("folder", folder);
      formData.append("slug", slug || fileToUpload.name.replace(/\.[^/.]+$/, ""));

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Error uploading file");
      }

      const data = await response.json();
      
      if (!data.path) {
        throw new Error("No file URL returned from upload");
      }

      onChange(data.path);
      setFile(null);
      
      if (onFileSelect) {
        onFileSelect(null);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error uploading file";
      setUploadError(errorMessage);
      console.error("Error uploading file:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
    setUploadError(null);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 block text-xs font-medium text-[var(--admin-text)]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="space-y-2">
        {/* Mostrar archivo actual o archivo seleccionado */}
        {(value || file) && (
          <div className="group relative rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                  <svg className="h-10 w-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[var(--admin-text)] truncate">
                    {file ? file.name : fileName || "File"}
                  </p>
                  {file && (
                    <p className="text-xs text-[var(--admin-text-muted)]">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="flex-shrink-0 rounded-full bg-red-50 p-1.5 text-red-500 transition hover:bg-red-100 z-10"
                title="Remove file"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Botón para seleccionar archivo */}
        {!value && !file && (
          <button
            type="button"
            onClick={triggerFileInput}
            className="w-full rounded-lg border-2 border-dashed border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 text-center transition hover:border-primary hover:bg-[var(--admin-primary-lighter)]"
          >
            <div className="flex flex-col items-center gap-2">
              <svg className="h-8 w-8 text-[var(--admin-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <div className="text-sm text-[var(--admin-text-muted)]">
                <span className="font-medium text-primary">Click to upload</span> or drag and drop
              </div>
              <p className="text-xs text-[var(--admin-text-muted)]">
                PDF, Word, Excel (max 20MB)
              </p>
            </div>
          </button>
        )}

        {/* Mostrar error */}
        {(uploadError || error) && (
          <p className="text-xs text-red-600">{(uploadError || error)}</p>
        )}

        {/* Mostrar estado de carga */}
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-[var(--admin-text-muted)]">
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </div>
        )}

        {/* Botón para cambiar archivo si ya hay uno */}
        {value && !file && (
          <button
            type="button"
            onClick={triggerFileInput}
            className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2 text-sm font-medium text-[var(--admin-text)] transition hover:bg-[var(--admin-primary-lighter)]"
          >
            Change file
          </button>
        )}

        {/* Si hay un archivo seleccionado pero no subido, mostrar botón de subir manualmente */}
        {file && !autoUpload && !uploading && (
          <button
            type="button"
            onClick={() => uploadFile(file)}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
          >
            Upload file
          </button>
        )}
      </div>
    </div>
  );
}

