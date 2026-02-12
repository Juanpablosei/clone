"use client";

import { useState, useEffect } from "react";
import ResourceForm from "../../../components/admin/ResourceForm";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import ImageUpload from "../../../components/admin/ImageUpload";
import EducationIntroSection from "../../../components/education/EducationIntroSection";
import ImageContentSection from "../../../components/education/ImageContentSection";
import Image from "next/image";

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

interface AccordionItem {
  title: string;
  content?: string;
}

interface EducationPageData {
  id: string;
  introBadge?: string | null;
  introTitle?: string | null;
  introDescription?: string | null;
  accordionItems?: AccordionItem[] | null;
  features?: string[] | null;
  contentImage?: string | null;
  contentImageAlt?: string | null;
  contentBadge?: string | null;
  contentTitle?: string | null;
  contentDescription?: string | null;
  iconType?: string | null;
}

type Tab = "content" | "resources";

export default function ResourcesPage() {
  const [activeTab, setActiveTab] = useState<Tab>("content");
  
  // Resources state
  const [resources, setResources] = useState<Resource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    resourceId: string | null;
    resourceTitle: string;
  }>({
    isOpen: false,
    resourceId: null,
    resourceTitle: "",
  });

  // Education page content state
  const [contentLoading, setContentLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pendingContentImageFile, setPendingContentImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<EducationPageData>({
    id: "education-page",
    introBadge: null,
    introTitle: null,
    introDescription: null,
    accordionItems: null,
    features: null,
    contentImage: null,
    contentImageAlt: null,
    contentBadge: null,
    contentTitle: null,
    contentDescription: null,
    iconType: null,
  });

  useEffect(() => {
    if (activeTab === "resources") {
      fetchResources();
    } else {
      fetchEducationPageData();
    }
  }, [activeTab]);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/admin/resources");
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch {
      console.error("Error fetching resources");
    } finally {
      setResourcesLoading(false);
    }
  };

  const fetchEducationPageData = async () => {
    try {
      const response = await fetch("/api/admin/education-page");
      if (response.ok) {
        const data = await response.json();
        setFormData({
          id: data.id || "education-page",
          introBadge: data.introBadge,
          introTitle: data.introTitle,
          introDescription: data.introDescription,
          accordionItems: Array.isArray(data.accordionItems) ? data.accordionItems : null,
          features: Array.isArray(data.features) ? data.features : null,
          contentImage: data.contentImage,
          contentImageAlt: data.contentImageAlt,
          contentBadge: data.contentBadge,
          contentTitle: data.contentTitle,
          contentDescription: data.contentDescription,
          iconType: data.iconType,
        });
      }
    } catch (err) {
      console.error("Error fetching education page:", err);
      setError("Error loading page data");
    } finally {
      setContentLoading(false);
    }
  };

  const handleContentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      let contentImageUrl = formData.contentImage || null;

      if (pendingContentImageFile) {
        const imageUploadForm = new FormData();
        imageUploadForm.append("file", pendingContentImageFile);
        imageUploadForm.append("folder", "resources");
        imageUploadForm.append("slug", "education-content");
        if (formData.contentImage) {
          imageUploadForm.append("previousUrl", formData.contentImage);
        }

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: imageUploadForm,
        });

        if (!uploadResponse.ok) {
          let uploadErrorMessage = "Error uploading content image";
          try {
            const uploadErrorData = await uploadResponse.json();
            uploadErrorMessage = uploadErrorData.error || uploadErrorMessage;
          } catch {
            // Keep fallback message if error response is not JSON
          }
          setError(uploadErrorMessage);
          return;
        }

        const uploadData = await uploadResponse.json();
        if (!uploadData?.path) {
          setError("Upload completed without image URL");
          return;
        }
        contentImageUrl = uploadData.path;
      }

      const payload = {
        ...formData,
        contentImage: contentImageUrl,
      };

      const response = await fetch("/api/admin/education-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData(payload);
        setPendingContentImageFile(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await response.json();
        setError(data.error || "Error saving page");
      }
    } catch (err) {
      console.error("Error saving:", err);
      setError("Error saving page");
    } finally {
      setSaving(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingResource(null);
    fetchResources();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingResource(null);
  };

  const handleDelete = (id: string) => {
    const resource = resources.find((r) => r.id === id);
    if (resource) {
      setDeleteModal({
        isOpen: true,
        resourceId: id,
        resourceTitle: resource.title,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.resourceId) return;

    try {
      const response = await fetch(
        `/api/admin/resources?id=${deleteModal.resourceId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchResources();
      } else {
        alert("Error deleting resource");
      }
    } catch {
      alert("Error deleting resource");
    } finally {
      setDeleteModal({
        isOpen: false,
        resourceId: null,
        resourceTitle: "",
      });
    }
  };

  const handleEdit = (id: string) => {
    const resource = resources.find((r) => r.id === id);
    if (resource) {
      setEditingResource(resource);
      setShowForm(true);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const accordionItems: AccordionItem[] = Array.isArray(formData.accordionItems) 
    ? formData.accordionItems 
    : [];
  const features: string[] = Array.isArray(formData.features) 
    ? formData.features 
    : [];

  const renderIcon = () => {
    if (formData.iconType === "chart") {
      return (
        <svg
          className="h-6 w-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      );
    }
    return null;
  };

  if (activeTab === "content" && contentLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--admin-text-muted)]">Loading...</p>
      </div>
    );
  }

  if (activeTab === "resources" && resourcesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--admin-text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[var(--admin-border)]">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-4 py-2 text-sm font-semibold transition ${
            activeTab === "content"
              ? "border-b-2 border-primary text-primary"
              : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
          }`}
        >
          Page Content
        </button>
        <button
          onClick={() => setActiveTab("resources")}
          className={`px-4 py-2 text-sm font-semibold transition ${
            activeTab === "resources"
              ? "border-b-2 border-primary text-primary"
              : "text-[var(--admin-text-muted)] hover:text-[var(--admin-text)]"
          }`}
        >
          Resources
        </button>
      </div>

      {/* Page Content Tab */}
      {activeTab === "content" && (
        <div className="min-h-screen bg-background text-foreground">
          {/* Barra superior fija con botón de guardar */}
          <div className="sticky top-0 z-50 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-6 py-4 shadow-sm">
            <div className="mx-auto flex max-w-[1600px] items-center justify-between">
              <h1 className="text-xl font-semibold text-[var(--admin-text)]">
                Education Page Editor
              </h1>
              <div className="flex items-center gap-4">
                {error && (
                  <div className="rounded-lg bg-red-50 px-3 py-1 text-xs text-red-600">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="rounded-lg bg-green-50 px-3 py-1 text-xs text-green-600">
                    Saved!
                  </div>
                )}
                <button
                  onClick={handleContentSubmit}
                  disabled={saving}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={handleContentSubmit}>
            <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
              {/* Education Intro Section */}
              <div className="relative mb-20">
                <div className="absolute -top-8 left-0 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Education Intro Section
                </div>
                <div className="relative">
                  {/* Badge Input */}
                  <div className="mb-6">
                    <input
                      type="text"
                      value={formData.introBadge || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, introBadge: e.target.value })
                      }
                      className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                      placeholder="Badge"
                    />
                  </div>

                  {/* Title Input */}
                  <div className="mb-6 grid gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="lg:w-[70%]">
                      <input
                        type="text"
                        value={formData.introTitle || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, introTitle: e.target.value })
                        }
                        className="w-full bg-transparent text-3xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                        placeholder="Title"
                      />
                    </div>
                    <div className="hidden lg:block" />
                  </div>

                  {/* Description and Accordions */}
                  <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
                    <div className="lg:w-[70%]">
                      <textarea
                        value={formData.introDescription || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, introDescription: e.target.value })
                        }
                        className="w-full bg-transparent text-base leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-lg"
                        placeholder="Description"
                        rows={4}
                      />
                    </div>
                    <div className="flex flex-col">
                      <div className="mb-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                        Accordion Items
                      </div>
                      <div className="flex flex-col divide-y divide-border">
                        {accordionItems.map((item, index) => (
                          <div key={index} className="py-4 first:pt-0 last:pb-0">
                            <input
                              type="text"
                              value={item.title}
                              onChange={(e) => {
                                const newItems = [...accordionItems];
                                newItems[index] = { ...newItems[index], title: e.target.value };
                                setFormData({ ...formData, accordionItems: newItems });
                              }}
                              className="mb-2 w-full bg-transparent text-lg font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                              placeholder="Accordion Title"
                            />
                            <textarea
                              value={item.content || ""}
                              onChange={(e) => {
                                const newItems = [...accordionItems];
                                newItems[index] = { ...newItems[index], content: e.target.value };
                                setFormData({ ...formData, accordionItems: newItems });
                              }}
                              className="w-full bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                              placeholder="Accordion Content"
                              rows={2}
                            />
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            accordionItems: [...accordionItems, { title: "", content: "" }],
                          });
                        }}
                        className="mt-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2 text-sm font-semibold text-[var(--admin-text)] transition hover:bg-[var(--admin-surface-hover)]"
                      >
                        + Add Accordion Item
                      </button>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-12 border-t border-border pt-8">
                    <div className="mb-4 text-sm font-semibold text-[var(--admin-text-muted)]">
                      Features
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...features];
                              newFeatures[index] = e.target.value;
                              setFormData({ ...formData, features: newFeatures });
                            }}
                            className="bg-transparent text-base text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                            placeholder="Feature"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newFeatures = features.filter((_, i) => i !== index);
                              setFormData({ ...formData, features: newFeatures });
                            }}
                            className="text-red-600 hover:text-red-700"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            features: [...features, ""],
                          });
                        }}
                        className="rounded-full border border-border bg-surface px-4 py-2 text-base text-foreground transition hover:bg-[var(--admin-surface-hover)]"
                      >
                        + Add Feature
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Content Section */}
              <div className="relative">
                <div className="absolute -top-8 left-0 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  Image Content Section
                </div>
                <div className="relative flex flex-col overflow-hidden rounded-lg lg:flex-row">
                  {/* Left Column - Image */}
                  <div className="relative h-[400px] w-full overflow-hidden lg:h-[600px] lg:w-1/2">
                    {formData.contentImage ? (
                      <div className="group relative h-full w-full">
                        <Image
                          src={formData.contentImage}
                          alt={formData.contentImageAlt || "Content image"}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-full items-center justify-center">
                            <ImageUpload
                              value={formData.contentImage}
                              onChange={(url) =>
                                setFormData({ ...formData, contentImage: url || null })
                              }
                              onFileSelect={(file) => setPendingContentImageFile(file)}
                              folder="resources"
                              slug="education-content"
                              className="text-white"
                              autoUpload={false}
                              previewSize="xl"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full items-center justify-center border-2 border-dashed border-[var(--admin-border)]">
                        <ImageUpload
                          value={null}
                          onChange={(url) =>
                            setFormData({ ...formData, contentImage: url || null })
                          }
                          onFileSelect={(file) => setPendingContentImageFile(file)}
                          folder="resources"
                          slug="education-content"
                          autoUpload={false}
                          previewSize="xl"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column - Content */}
                  <div className="relative flex min-h-[400px] w-full flex-col justify-between bg-primary/10 lg:min-h-[600px] lg:w-1/2 lg:bg-primary/15">
                    <div className="relative flex flex-col gap-6 p-8 sm:p-10 lg:p-12">
                      {/* Badge */}
                      <input
                        type="text"
                        value={formData.contentBadge || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, contentBadge: e.target.value })
                        }
                        className="inline-flex w-fit items-center rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                        placeholder="Badge"
                      />

                      {/* Icon Type Selector */}
                      <div className="absolute right-8 top-8 sm:right-10 sm:top-10">
                        <select
                          value={formData.iconType || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, iconType: e.target.value || null })
                          }
                          className="h-12 w-12 rounded-full bg-primary-strong text-white outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                        >
                          <option value="">None</option>
                          <option value="chart">Chart</option>
                        </select>
                      </div>

                      {/* Title */}
                      <input
                        type="text"
                        value={formData.contentTitle || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, contentTitle: e.target.value })
                        }
                        className="w-full bg-transparent text-3xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                        placeholder="Title"
                      />
                    </div>

                    {/* Description */}
                    <div className="p-8 sm:p-10 lg:p-12 lg:pt-0">
                      <textarea
                        value={formData.contentDescription || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, contentDescription: e.target.value })
                        }
                        className="w-full bg-transparent text-base leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-lg lg:w-[70%]"
                        placeholder="Description"
                        rows={4}
                      />
                      <div className="mt-2">
                        <input
                          type="text"
                          value={formData.contentImageAlt || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, contentImageAlt: e.target.value })
                          }
                          className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2 text-sm text-[var(--admin-text)] outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary lg:w-[70%]"
                          placeholder="Image Alt Text (for SEO)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Resources Tab */}
      {activeTab === "resources" && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold text-[var(--admin-text)]">
              Resources
            </h1>
            {!showForm && (
              <button
                onClick={() => {
                  setEditingResource(null);
                  setShowForm(true);
                }}
                className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Resource
              </button>
            )}
          </div>

          {showForm && (
            <ResourceForm
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
              resource={editingResource}
            />
          )}

          {!showForm && (
            <>
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
                />
              </div>

              {filteredResources.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-[var(--admin-text-muted)]">
                    {searchQuery
                      ? "No resources found matching your criteria"
                      : "No resources yet"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredResources.map((resource) => (
                    <div
                      key={resource.id}
                      className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 shadow-sm"
                    >
                      {resource.image && (
                        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-lg">
                          <img
                            src={resource.image}
                            alt={resource.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="mb-2 flex items-center gap-2">
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                          {resource.fileType}
                        </span>
                        {resource.requireEmail && (
                          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                            Requires Email
                          </span>
                        )}
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-[var(--admin-text)]">
                        {resource.title}
                      </h3>
                      <p className="mb-4 line-clamp-3 text-sm text-[var(--admin-text-muted)]">
                        {resource.description}
                      </p>
                      {resource.tags.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1">
                          {resource.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-[var(--admin-border)] bg-[var(--admin-surface)] px-2 py-0.5 text-xs text-[var(--admin-text-muted)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(resource.id)}
                          className="flex-1 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(resource.id)}
                          className="rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          <ConfirmModal
            isOpen={deleteModal.isOpen}
            onClose={() =>
              setDeleteModal({
                isOpen: false,
                resourceId: null,
                resourceTitle: "",
              })
            }
            onConfirm={confirmDelete}
            title="Delete Resource"
            message={`Are you sure you want to delete "${deleteModal.resourceTitle}"? This action cannot be undone.`}
            confirmText="Delete"
            cancelText="Cancel"
            confirmColor="danger"
          />
        </>
      )}
    </div>
  );
}
