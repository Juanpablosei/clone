"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../../../components/admin/ImageUpload";
import Image from "next/image";

interface AccordionItem {
  title: string;
  content?: string;
}

interface ResearchPublicationsPageData {
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

const API = "/api/admin/research-publications-page";
const IMAGE_FOLDER = "resources";
const IMAGE_SLUG = "research-publications-content";

export default function ResearchPublicationsAdminPage() {
  const [contentLoading, setContentLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pendingContentImageFile, setPendingContentImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<ResearchPublicationsPageData>({
    id: "research-publications-page",
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
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(API);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          id: data.id || "research-publications-page",
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
      console.error("Error fetching research publications page:", err);
      setError("Error loading page data");
    } finally {
      setContentLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);
    try {
      let contentImageUrl = formData.contentImage || null;

      if (pendingContentImageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", pendingContentImageFile);
        formDataUpload.append("folder", IMAGE_FOLDER);
        formDataUpload.append("slug", IMAGE_SLUG);
        if (formData.contentImage) {
          formDataUpload.append("previousUrl", formData.contentImage);
        }

        const uploadResponse = await fetch("/api/admin/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!uploadResponse.ok) {
          const data = await uploadResponse.json().catch(() => ({}));
          setError(data.error || "Error uploading content image");
          return;
        }

        const uploadData = await uploadResponse.json();
        contentImageUrl = uploadData.path || contentImageUrl;
      }

      const payload = {
        ...formData,
        contentImage: contentImageUrl,
      };

      const res = await fetch(API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setFormData(payload);
        setPendingContentImageFile(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Error saving page");
      }
    } catch (err) {
      console.error("Error saving:", err);
      setError("Error saving page");
    } finally {
      setSaving(false);
    }
  };

  const accordionItems: AccordionItem[] = Array.isArray(formData.accordionItems) ? formData.accordionItems : [];
  const features: string[] = Array.isArray(formData.features) ? formData.features : [];

  if (contentLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--admin-text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="sticky top-0 z-50 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <h1 className="text-xl font-semibold text-[var(--admin-text)]">Research & Publications – Page Content</h1>
          <div className="flex items-center gap-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-1 text-xs text-red-600">{error}</div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 px-3 py-1 text-xs text-green-600">Saved!</div>
            )}
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mx-auto max-w-[1600px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          {/* Intro Section */}
          <div className="relative mb-20">
            <div className="absolute -top-8 left-0 rounded-lg bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Intro Section
            </div>
            <div className="relative">
              <div className="mb-6">
                <input
                  type="text"
                  value={formData.introBadge || ""}
                  onChange={(e) => setFormData({ ...formData, introBadge: e.target.value })}
                  className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Badge"
                />
              </div>
              <div className="mb-6 grid gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="lg:w-[70%]">
                  <input
                    type="text"
                    value={formData.introTitle || ""}
                    onChange={(e) => setFormData({ ...formData, introTitle: e.target.value })}
                    className="w-full bg-transparent text-3xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                    placeholder="Title"
                  />
                </div>
                <div className="hidden lg:block" />
              </div>
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
                <div className="lg:w-[70%]">
                  <textarea
                    value={formData.introDescription || ""}
                    onChange={(e) => setFormData({ ...formData, introDescription: e.target.value })}
                    className="w-full bg-transparent text-base leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-lg"
                    placeholder="Description"
                    rows={4}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="mb-4 text-sm font-semibold text-[var(--admin-text-muted)]">Accordion Items</div>
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
                    onClick={() =>
                      setFormData({
                        ...formData,
                        accordionItems: [...accordionItems, { title: "", content: "" }],
                      })
                    }
                    className="mt-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2 text-sm font-semibold text-[var(--admin-text)] transition hover:bg-[var(--admin-surface-hover)]"
                  >
                    + Add Accordion Item
                  </button>
                </div>
              </div>
              <div className="mt-12 border-t border-border pt-8">
                <div className="mb-4 text-sm font-semibold text-[var(--admin-text-muted)]">Features</div>
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
                    onClick={() => setFormData({ ...formData, features: [...features, ""] })}
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
                          onChange={(url) => setFormData({ ...formData, contentImage: url || null })}
                          onFileSelect={(file) => setPendingContentImageFile(file)}
                          folder={IMAGE_FOLDER}
                          slug={IMAGE_SLUG}
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
                      onChange={(url) => setFormData({ ...formData, contentImage: url || null })}
                      onFileSelect={(file) => setPendingContentImageFile(file)}
                      folder={IMAGE_FOLDER}
                      slug={IMAGE_SLUG}
                      autoUpload={false}
                      previewSize="xl"
                    />
                  </div>
                )}
              </div>
              <div className="relative flex min-h-[400px] w-full flex-col justify-between bg-primary/10 lg:min-h-[600px] lg:w-1/2 lg:bg-primary/15">
                <div className="relative flex flex-col gap-6 p-8 sm:p-10 lg:p-12">
                  <input
                    type="text"
                    value={formData.contentBadge || ""}
                    onChange={(e) => setFormData({ ...formData, contentBadge: e.target.value })}
                    className="inline-flex w-fit items-center rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="Badge"
                  />
                  <div className="absolute right-8 top-8 sm:right-10 sm:top-10">
                    <select
                      value={formData.iconType || ""}
                      onChange={(e) => setFormData({ ...formData, iconType: e.target.value || null })}
                      className="h-12 w-12 rounded-full bg-primary-strong text-white outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    >
                      <option value="">None</option>
                      <option value="chart">Chart</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    value={formData.contentTitle || ""}
                    onChange={(e) => setFormData({ ...formData, contentTitle: e.target.value })}
                    className="w-full bg-transparent text-3xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                    placeholder="Title"
                  />
                </div>
                <div className="p-8 sm:p-10 lg:p-12 lg:pt-0">
                  <textarea
                    value={formData.contentDescription || ""}
                    onChange={(e) => setFormData({ ...formData, contentDescription: e.target.value })}
                    className="w-full bg-transparent text-base leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-lg lg:w-[70%]"
                    placeholder="Description"
                    rows={4}
                  />
                  <div className="mt-2">
                    <input
                      type="text"
                      value={formData.contentImageAlt || ""}
                      onChange={(e) => setFormData({ ...formData, contentImageAlt: e.target.value })}
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
  );
}
