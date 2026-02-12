"use client";

import { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import DownloadModal from "./DownloadModal";
import SuccessModal from "./SuccessModal";

export interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  tags: string[];
  image?: string;
  requireEmail: boolean;
}

export default function ResourcesSection() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState({ title: "", message: "" });
  const [selectedTag, setSelectedTag] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources");
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const allTags = Array.from(
    new Set(resources.flatMap((resource) => resource.tags))
  );

  const filteredResources = resources.filter((resource) => {
    const matchesTag =
      selectedTag === "All" || resource.tags.includes(selectedTag);
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const triggerForcedDownload = (resource: Resource) => {
    // Solo descargar si el archivo está en /resources/ (carpeta pública)
    if (!resource.fileUrl.startsWith("/resources/")) {
      console.warn("Resource file URL is not local:", resource.fileUrl);
      // Si es una URL antigua de Cloudinary, mostrar mensaje o simplemente no hacer nada
      alert("Este recurso necesita ser actualizado. Por favor, contacte al administrador.");
      return;
    }

    // Extraer nombre del archivo de la URL
    const fileName = resource.fileUrl.split("/").pop() || resource.title || "resource";
    
    // Usar el endpoint de descarga para forzar descarga desde la carpeta pública
    const downloadUrl = `/api/download-resource?url=${encodeURIComponent(resource.fileUrl)}&filename=${encodeURIComponent(fileName)}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadClick = (resource: Resource) => {
    setSelectedResource(resource);
    
    // Si requireEmail es false, descargar directamente
    if (!resource.requireEmail) {
      triggerForcedDownload(resource);
      return;
    }
    
    // Si requireEmail es true, mostrar modal para pedir email
    setIsModalOpen(true);
  };

  const handleDownloadSubmit = (name: string, email: string) => {
    if (!selectedResource) return;
    
    // Guardar el download request
    fetch("/api/resource-downloads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        resourceTitle: selectedResource.title,
      }),
    }).catch((error) => {
      console.error("Error saving download:", error);
    });
    
    // Descargar el archivo
    triggerForcedDownload(selectedResource);
    
    // Cerrar el modal de formulario
    setIsModalOpen(false);
    
    // Mostrar modal de éxito
    setSuccessMessage({
      title: "Download Started",
      message: `Thank you, ${name}! Your download of "${selectedResource.title}" has started.`,
    });
    setIsSuccessModalOpen(true);
    
    setSelectedResource(null);
  };

  return (
    <section id="resources" className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-[0.08em] text-primary-strong">
            Downloadable Resources
          </span>
          <h2 className="text-3xl font-semibold text-foreground">
            Tools, Frameworks & Guides
          </h2>
          <p className="max-w-2xl text-muted">
            Access our collection of downloadable resources including PDFs,
            tools, and frameworks designed to help you implement responsible AI
            practices.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag("All")}
            className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
              selectedTag === "All"
                ? "border-primary bg-primary text-white"
                : "border-border bg-surface text-foreground hover:border-primary"
            }`}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                selectedTag === tag
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-surface text-foreground hover:border-primary"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted">Loading resources...</p>
        </div>
      ) : filteredResources.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredResources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onDownloadClick={() => handleDownloadClick(resource)}
            />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted">No resources found with the selected filters.</p>
        </div>
      )}

      {/* Download Modal */}
      {selectedResource && (
        <DownloadModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedResource(null);
          }}
          resource={selectedResource}
          onSubmit={handleDownloadSubmit}
        />
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title={successMessage.title}
        message={successMessage.message}
      />
    </section>
  );
}

