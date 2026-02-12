"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../../../components/admin/ImageUpload";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorToolbar } from "../../../components/admin/EditorToolbar";
import { HighlightMark } from "../../../components/admin/HighlightMark";
import { TestimonialSectionEditor } from "../../../components/admin/TestimonialSectionEditor";
import AtomicBackground from "../../../components/home/AtomicBackground";
import Image from "next/image";

interface AboutUsPageData {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  missionImage: string;
  missionLabel: string;
  missionTitle: string;
  missionContent: string;
  approachImage: string;
  approachLabel: string;
  approachTitle: string;
  approachContent: string;
  historyImage: string;
  historyLabel: string;
  historyTitle: string;
  historyContent: string;
}

interface SectionItem {
  title: string;
  content: string;
}

interface TestimonialItem {
  id: string;
  image: string;
  imageAlt: string | null;
  category: string;
  headline: string;
  ctaText: string;
  slug: string;
  summary: string;
  industry: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  highlightedWord: string | null;
  metric: string | null;
  metricDescription: string | null;
  sections: SectionItem[] | null;
  order: number;
}

export default function AboutUsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [testimonialForm, setTestimonialForm] = useState<Partial<TestimonialItem> | null>(null);
  const [savingTestimonial, setSavingTestimonial] = useState(false);
  const [missionImageFile, setMissionImageFile] = useState<File | null>(null);
  const [approachImageFile, setApproachImageFile] = useState<File | null>(null);
  const [historyImageFile, setHistoryImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<AboutUsPageData>({
    id: "about-us-page",
    heroTitle: "",
    heroSubtitle: "",
    missionImage: "",
    missionLabel: "",
    missionTitle: "",
    missionContent: "",
    approachImage: "",
    approachLabel: "",
    approachTitle: "",
    approachContent: "",
    historyImage: "",
    historyLabel: "",
    historyTitle: "",
    historyContent: "",
  });

  // Editors para contenido rico
  const missionEditor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: formData.missionContent,
  });

  const approachEditor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: formData.approachContent,
  });

  const historyEditor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: formData.historyContent,
  });

  // Editor para headline del testimonial: tamaños, negrita, color, destacar (como en noticias)
  const headlineEditor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ blockquote: false, codeBlock: false, horizontalRule: false }),
      TextStyle,
      Color,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      HighlightMark,
    ],
    content: "<p></p>",
  });

  // Editor para summary del testimonial (contenido rico)
  const summaryEditor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: "<p></p>",
  });

  useEffect(() => {
    fetchData();
  }, []);

  // Sincronizar headline y summary del formulario con los editors cuando se abre/edita
  useEffect(() => {
    if (testimonialForm === null) return;
    const rawHeadline = testimonialForm.headline ?? "";
    const headlineContent = rawHeadline.startsWith("<") ? rawHeadline : `<p>${rawHeadline || ""}</p>`;
    if (headlineEditor) headlineEditor.commands.setContent(headlineContent);
    const rawSummary = testimonialForm.summary ?? "";
    const summaryContent = rawSummary.startsWith("<") ? rawSummary : rawSummary ? `<p>${rawSummary}</p>` : "<p></p>";
    if (summaryEditor) summaryEditor.commands.setContent(summaryContent);
  }, [testimonialForm?.id, testimonialForm?.headline, testimonialForm?.summary, headlineEditor, summaryEditor]);

  useEffect(() => {
    if (missionEditor && formData.missionContent) {
      missionEditor.commands.setContent(formData.missionContent);
    }
  }, [formData.missionContent, missionEditor]);

  useEffect(() => {
    if (approachEditor && formData.approachContent) {
      approachEditor.commands.setContent(formData.approachContent);
    }
  }, [formData.approachContent, approachEditor]);

  useEffect(() => {
    if (historyEditor && formData.historyContent) {
      historyEditor.commands.setContent(formData.historyContent);
    }
  }, [formData.historyContent, historyEditor]);

  const fetchTestimonials = async () => {
    try {
      const res = await fetch("/api/admin/about-us/testimonials");
      if (res.ok) {
        const data = await res.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error("Error fetching testimonials:", err);
    }
  };

  const fetchData = async () => {
    try {
      const [pageRes, testimonialsRes] = await Promise.all([
        fetch("/api/admin/about-us"),
        fetch("/api/admin/about-us/testimonials"),
      ]);
      if (pageRes.ok) {
        const data = await pageRes.json();
        setFormData(data);
        if (missionEditor) missionEditor.commands.setContent(data.missionContent || "");
        if (approachEditor) approachEditor.commands.setContent(data.approachContent || "");
        if (historyEditor) historyEditor.commands.setContent(data.historyContent || "");
      }
      if (testimonialsRes.ok) {
        const data = await testimonialsRes.json();
        setTestimonials(data);
      }
    } catch (err) {
      console.error("Error fetching about-us page:", err);
      setError("Error loading page data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setSaving(true);

    try {
      const uploadImageOnSave = async (
        file: File | null,
        previousUrl: string,
        slug: string
      ): Promise<string> => {
        if (!file) return previousUrl;

        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("folder", "about-us");
        formDataUpload.append("slug", slug);
        if (previousUrl) {
          formDataUpload.append("previousUrl", previousUrl);
        }

        const uploadRes = await fetch("/api/admin/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!uploadRes.ok) {
          let msg = "Error uploading image";
          try {
            const errData = await uploadRes.json();
            msg = errData.error || msg;
          } catch {}
          throw new Error(msg);
        }

        const uploadData = await uploadRes.json();
        if (!uploadData?.path) {
          throw new Error("Upload completed without URL");
        }
        return uploadData.path as string;
      };

      const missionImageUrl = await uploadImageOnSave(
        missionImageFile,
        formData.missionImage,
        "mission"
      );
      const approachImageUrl = await uploadImageOnSave(
        approachImageFile,
        formData.approachImage,
        "approach"
      );
      const historyImageUrl = await uploadImageOnSave(
        historyImageFile,
        formData.historyImage,
        "history"
      );

      const submitData = {
        ...formData,
        missionImage: missionImageUrl,
        approachImage: approachImageUrl,
        historyImage: historyImageUrl,
        missionContent: missionEditor?.getHTML() || formData.missionContent,
        approachContent: approachEditor?.getHTML() || formData.approachContent,
        historyContent: historyEditor?.getHTML() || formData.historyContent,
      };

      const response = await fetch("/api/admin/about-us", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        setFormData((prev) => ({
          ...prev,
          missionImage: missionImageUrl,
          approachImage: approachImageUrl,
          historyImage: historyImageUrl,
        }));
        setMissionImageFile(null);
        setApproachImageFile(null);
        setHistoryImageFile(null);
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

  const handleSaveTestimonial = async () => {
    const headlineHtml = headlineEditor?.getHTML() ?? testimonialForm?.headline ?? "";
    const headline = headlineHtml.replace(/^<p>|<\/p>$/gi, "").trim() || (testimonialForm?.headline ?? "");
    const summary = summaryEditor?.getHTML() ?? testimonialForm?.summary ?? "";
    if (!testimonialForm || !testimonialForm.image || !testimonialForm.category || !headline || !testimonialForm.ctaText || !testimonialForm.slug || !summary) {
      setError("Image, category, headline, CTA text, slug and summary are required");
      return;
    }
    setError("");
    setSavingTestimonial(true);
    try {
      const isEdit = !!testimonialForm.id;
      const url = "/api/admin/about-us/testimonials";
      const method = isEdit ? "PUT" : "POST";
      const body = {
        ...(isEdit && { id: testimonialForm.id }),
        image: testimonialForm.image,
        imageAlt: testimonialForm.imageAlt ?? null,
        category: testimonialForm.category,
        headline,
        ctaText: testimonialForm.ctaText,
        slug: testimonialForm.slug,
        summary,
        industry: testimonialForm.industry ?? null,
        heroImage: testimonialForm.heroImage ?? null,
        heroImageAlt: testimonialForm.heroImageAlt ?? null,
        highlightedWord: testimonialForm.highlightedWord ?? null,
        metric: testimonialForm.metric ?? null,
        metricDescription: testimonialForm.metricDescription ?? null,
        sections: Array.isArray(testimonialForm.sections) ? testimonialForm.sections : null,
      };
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (res.ok) {
        await fetchTestimonials();
        setTestimonialForm(null);
      } else {
        const data = await res.json();
        setError(data.error || "Error saving testimonial");
      }
    } catch (err) {
      console.error("Error saving testimonial:", err);
      setError("Error saving testimonial");
    } finally {
      setSavingTestimonial(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    setError("");
    try {
      const res = await fetch(`/api/admin/about-us/testimonials?id=${encodeURIComponent(id)}`, { method: "DELETE" });
      if (res.ok) {
        await fetchTestimonials();
        if (testimonialForm?.id === id) setTestimonialForm(null);
      } else {
        const data = await res.json();
        setError(data.error || "Error deleting testimonial");
      }
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      setError("Error deleting testimonial");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--admin-text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra superior fija con botón de guardar */}
      <div className="sticky top-0 z-50 border-b border-[var(--admin-border)] bg-[var(--admin-surface)] px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <h1 className="text-xl font-semibold text-[var(--admin-text)]">About Us Page Editor</h1>
          <div className="flex items-center gap-4">
            {error && (
              <div className="rounded-lg bg-red-50 px-3 py-1 text-xs text-red-600">{error}</div>
            )}
            {success && (
              <div className="rounded-lg bg-green-50 px-3 py-1 text-xs text-green-600">
                Saved!
              </div>
            )}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Hero Section */}
        <section
          className="relative w-full overflow-hidden border-b border-primary/20 h-[250px] sm:h-[400px] lg:h-[500px]"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            background: "linear-gradient(to right, rgba(91, 125, 214, 0.8), rgba(91, 125, 214, 0.3))",
          }}
        >
          <AtomicBackground />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center justify-center">
            <div className="px-6 text-center sm:px-10 lg:px-16">
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full max-w-6xl mx-auto bg-transparent text-center text-4xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-5xl lg:text-6xl"
                placeholder="Hero Title"
                required
              />
              <textarea
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="mx-auto mt-6 max-w-3xl w-full bg-transparent text-center text-base leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-lg lg:text-xl"
                placeholder="Hero Subtitle"
                rows={3}
                required
              />
            </div>
          </div>
        </section>

        <main className="flex flex-col gap-20 px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          {/* Mission Section */}
          <section className="mx-auto w-full max-w-[1600px]">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
              {/* Imagen a la izquierda - editable */}
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg sm:h-[500px] lg:h-[600px] group">
                {formData.missionImage ? (
                  <Image
                    src={formData.missionImage}
                    alt={formData.missionLabel || "Mission"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <p className="text-muted-foreground">No image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-white/90 rounded-lg p-4">
                      <ImageUpload
                        value={formData.missionImage}
                        onChange={(url) => setFormData({ ...formData, missionImage: url || "" })}
                        onFileSelect={(file) => setMissionImageFile(file)}
                        folder="about-us"
                        slug="mission"
                        label=""
                        autoUpload={false}
                        previewSize="xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Texto a la derecha */}
              <div className="flex flex-col gap-6 text-left">
                <div className="w-[70%]">
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={formData.missionLabel}
                      onChange={(e) => setFormData({ ...formData, missionLabel: e.target.value })}
                      className="w-full bg-transparent text-sm font-semibold uppercase tracking-[0.08em] text-primary-strong outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={formData.missionTitle}
                      onChange={(e) => setFormData({ ...formData, missionTitle: e.target.value })}
                      className="mt-3 w-full bg-transparent text-3xl font-semibold text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                      placeholder="Title"
                    />
                  </div>
                  <div className="mt-6 prose prose-lg max-w-none">
                    {missionEditor && (
                      <div className="rounded-lg border border-transparent hover:border-primary/50 focus-within:border-primary">
                        <EditorToolbar editor={missionEditor} />
                        <EditorContent
                          editor={missionEditor}
                          className="[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:text-lg [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:text-muted"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Approach Section */}
          <section className="mx-auto w-full max-w-[1600px]">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
              {/* Texto a la izquierda - justificado a la derecha */}
              <div className="order-2 flex flex-col gap-6 text-left lg:order-1 lg:text-right">
                <div className="w-[70%] lg:ml-auto">
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={formData.approachLabel}
                      onChange={(e) => setFormData({ ...formData, approachLabel: e.target.value })}
                      className="w-full bg-transparent text-sm font-semibold uppercase tracking-[0.08em] text-primary-strong outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={formData.approachTitle}
                      onChange={(e) => setFormData({ ...formData, approachTitle: e.target.value })}
                      className="mt-3 w-full bg-transparent text-3xl font-semibold text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                      placeholder="Title"
                    />
                  </div>
                  <div className="mt-6 prose prose-lg max-w-none">
                    {approachEditor && (
                      <div className="rounded-lg border border-transparent hover:border-primary/50 focus-within:border-primary">
                        <EditorToolbar editor={approachEditor} />
                        <EditorContent
                          editor={approachEditor}
                          className="[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:text-lg [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:text-muted"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Imagen a la derecha - editable */}
              <div className="order-1 relative h-[400px] w-full overflow-hidden rounded-lg sm:h-[500px] lg:order-2 lg:h-[600px] group">
                {formData.approachImage ? (
                  <Image
                    src={formData.approachImage}
                    alt={formData.approachLabel || "Approach"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <p className="text-muted-foreground">No image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-white/90 rounded-lg p-4">
                      <ImageUpload
                        value={formData.approachImage}
                        onChange={(url) => setFormData({ ...formData, approachImage: url || "" })}
                        onFileSelect={(file) => setApproachImageFile(file)}
                        folder="about-us"
                        slug="approach"
                        label=""
                        autoUpload={false}
                        previewSize="xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* History Section */}
          <section className="mx-auto w-full max-w-[1600px]">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
              {/* Imagen a la izquierda - editable */}
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg sm:h-[500px] lg:h-[600px] group">
                {formData.historyImage ? (
                  <Image
                    src={formData.historyImage}
                    alt={formData.historyLabel || "History"}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-muted">
                    <p className="text-muted-foreground">No image</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <div className="bg-white/90 rounded-lg p-4">
                      <ImageUpload
                        value={formData.historyImage}
                        onChange={(url) => setFormData({ ...formData, historyImage: url || "" })}
                        onFileSelect={(file) => setHistoryImageFile(file)}
                        folder="about-us"
                        slug="history"
                        label=""
                        autoUpload={false}
                        previewSize="xl"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Texto a la derecha */}
              <div className="flex flex-col gap-6 text-left">
                <div className="w-[70%]">
                  <div className="flex flex-col gap-3">
                    <input
                      type="text"
                      value={formData.historyLabel}
                      onChange={(e) => setFormData({ ...formData, historyLabel: e.target.value })}
                      className="w-full bg-transparent text-sm font-semibold uppercase tracking-[0.08em] text-primary-strong outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={formData.historyTitle}
                      onChange={(e) => setFormData({ ...formData, historyTitle: e.target.value })}
                      className="mt-3 w-full bg-transparent text-3xl font-semibold text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                      placeholder="Title"
                    />
                  </div>
                  <div className="mt-6 prose prose-lg max-w-none">
                    {historyEditor && (
                      <div className="rounded-lg border border-transparent hover:border-primary/50 focus-within:border-primary">
                        <EditorToolbar editor={historyEditor} />
                        <EditorContent
                          editor={historyEditor}
                          className="[&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:text-lg [&_.ProseMirror]:leading-relaxed [&_.ProseMirror]:text-muted"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials / Success stories carousel */}
          <section className="mx-auto w-full max-w-[1600px] border-t border-[var(--admin-border)] pt-12">
            <h2 className="text-lg font-semibold text-[var(--admin-text)] mb-4">Testimonials & Success stories (carousel)</h2>
            <p className="text-sm text-[var(--admin-text-muted)] mb-6">Slides shown in the carousel on the About Us page. Order is by creation; you can add, edit or delete.</p>

            <div className="space-y-4 mb-8">
              {testimonials.map((t) => (
                <div key={t.id} className="flex items-center gap-4 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-muted">
                    {t.image ? (
                      <Image src={t.image} alt={t.imageAlt || ""} fill className="object-cover" unoptimized />
                    ) : (
                      <span className="text-xs text-muted-foreground flex items-center justify-center h-full">No image</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div
                      className="font-medium text-[var(--admin-text)] truncate [&_strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: (t.headline ?? "").replace(/^<p>|<\/p>$/gi, "").trim() || (t.headline ?? "") }}
                    />
                    <p className="text-xs text-[var(--admin-text-muted)]">{t.category}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setTestimonialForm({ ...t })}
                      className="rounded bg-primary/20 px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/30"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteTestimonial(t.id)}
                      className="rounded bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {testimonialForm !== null ? (
              <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 space-y-4">
                <h3 className="font-medium text-[var(--admin-text)]">{testimonialForm.id ? "Edit testimonial" : "Add testimonial"}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Image</label>
                    <ImageUpload
                      value={testimonialForm.image || ""}
                      onChange={(url) => setTestimonialForm((f) => (f ? { ...f, image: url || "" } : null))}
                      folder="about-us"
                      slug={testimonialForm.id || `testimonial-${Date.now()}`}
                      autoUpload={true}
                      previewSize="md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Image alt text</label>
                    <input
                      type="text"
                      value={testimonialForm.imageAlt ?? ""}
                      onChange={(e) => setTestimonialForm((f) => (f ? { ...f, imageAlt: e.target.value || null } : null))}
                      className="w-full rounded border border-[var(--admin-border)] bg-background px-3 py-2 text-sm"
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Category *</label>
                    <input
                      type="text"
                      value={testimonialForm.category ?? ""}
                      onChange={(e) => setTestimonialForm((f) => (f ? { ...f, category: e.target.value } : null))}
                      className="w-full rounded border border-[var(--admin-border)] bg-background px-3 py-2 text-sm"
                      placeholder="e.g. SUCCESS STORY, CASE STUDY"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Headline * (tamaños, negrita, color, «Destacar palabra» en verde)</label>
                    <div className="rounded-lg border border-[var(--admin-border)] bg-background overflow-hidden">
                      {headlineEditor && (
                        <>
                          <div className="flex flex-wrap items-center gap-1 border-b border-[var(--admin-border)] bg-muted/30 px-2 py-1.5">
                            <button
                              type="button"
                              onClick={() => headlineEditor.chain().focus().toggleMark("highlight").run()}
                              className={`rounded px-2 py-1 text-xs font-medium transition ${
                                headlineEditor.isActive("highlight") ? "bg-primary text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              Destacar
                            </button>
                            <div className="mx-1 h-4 w-px bg-border" />
                            <EditorToolbar editor={headlineEditor} />
                          </div>
                          <EditorContent
                            editor={headlineEditor}
                            className="[&_.ProseMirror]:min-h-[44px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:text-sm [&_.ProseMirror]:outline-none"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">CTA button text *</label>
                    <input
                      type="text"
                      value={testimonialForm.ctaText ?? ""}
                      onChange={(e) => setTestimonialForm((f) => (f ? { ...f, ctaText: e.target.value } : null))}
                      className="w-full rounded border border-[var(--admin-border)] bg-background px-3 py-2 text-sm"
                      placeholder="e.g. Read Full Story"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Slug * (URL: /success-stories/...)</label>
                    <input
                      type="text"
                      value={testimonialForm.slug ?? ""}
                      onChange={(e) => setTestimonialForm((f) => (f ? { ...f, slug: e.target.value } : null))}
                      className="w-full rounded border border-[var(--admin-border)] bg-background px-3 py-2 text-sm"
                      placeholder="e.g. salesforce-integration-healthcare"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Summary * (tamaños, negrita, color — como en noticias)</label>
                  <div className="rounded-lg border border-[var(--admin-border)] overflow-hidden bg-background">
                    {summaryEditor && (
                      <>
                        <EditorToolbar editor={summaryEditor} />
                        <EditorContent
                          editor={summaryEditor}
                          className="[&_.ProseMirror]:min-h-[120px] [&_.ProseMirror]:p-3 [&_.ProseMirror]:text-sm [&_.ProseMirror]:outline-none"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Industry</label>
                    <input
                      type="text"
                      value={testimonialForm.industry ?? ""}
                      onChange={(e) => setTestimonialForm((f) => (f ? { ...f, industry: e.target.value || null } : null))}
                      className="w-full rounded border border-[var(--admin-border)] bg-background px-3 py-2 text-sm"
                      placeholder="e.g. LIFE SCIENCES & HEALTH CARE"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Highlighted word (en el headline)</label>
                    <input
                      type="text"
                      value={testimonialForm.highlightedWord ?? ""}
                      onChange={(e) => setTestimonialForm((f) => (f ? { ...f, highlightedWord: e.target.value || null } : null))}
                      className="w-full rounded border border-[var(--admin-border)] bg-background px-3 py-2 text-sm"
                      placeholder="Palabra a destacar en verde"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Hero image (página)</label>
                    <ImageUpload
                      value={testimonialForm.heroImage ?? ""}
                      onChange={(url) => setTestimonialForm((f) => (f ? { ...f, heroImage: url || null } : null))}
                      folder="about-us"
                      slug={testimonialForm.slug ? `hero-${testimonialForm.slug}` : `hero-${Date.now()}`}
                      autoUpload={true}
                      previewSize="md"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Si está vacío se usa la imagen del carrusel</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Hero image alt</label>
                    <input
                      type="text"
                      value={testimonialForm.heroImageAlt ?? ""}
                      onChange={(e) => setTestimonialForm((f) => (f ? { ...f, heroImageAlt: e.target.value || null } : null))}
                      className="w-full rounded border border-[var(--admin-border)] bg-background px-3 py-2 text-sm"
                      placeholder="Opcional"
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Metric (ej. 1.6x)</label>
                    <input
                      type="text"
                      value={testimonialForm.metric ?? ""}
                      onChange={(e) => setTestimonialForm((f) => (f ? { ...f, metric: e.target.value || null } : null))}
                      className="w-full rounded border border-[var(--admin-border)] bg-background px-3 py-2 text-sm"
                      placeholder="Opcional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-1">Metric description</label>
                    <input
                      type="text"
                      value={testimonialForm.metricDescription ?? ""}
                      onChange={(e) => setTestimonialForm((f) => (f ? { ...f, metricDescription: e.target.value || null } : null))}
                      className="w-full rounded border border-[var(--admin-border)] bg-background px-3 py-2 text-sm"
                      placeholder="Opcional"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--admin-text-muted)] mb-2">Secciones de la página (título + contenido con formato: tamaños, negrita, color)</label>
                  {(testimonialForm.sections ?? []).map((sec, idx) => (
                    <div key={idx} className="flex flex-col gap-2 mb-4 p-3 rounded border border-[var(--admin-border)] bg-muted/30">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-muted-foreground">Sección {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => setTestimonialForm((f) => (f && f.sections ? { ...f, sections: f.sections.filter((_, i) => i !== idx) } : null))}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Quitar
                        </button>
                      </div>
                      <input
                        type="text"
                        value={sec.title}
                        onChange={(e) => {
                          const next = [...(testimonialForm?.sections ?? [])];
                          next[idx] = { ...next[idx]!, title: e.target.value, content: next[idx]!.content };
                          setTestimonialForm((f) => (f ? { ...f, sections: next } : null));
                        }}
                        className="w-full rounded border border-[var(--admin-border)] bg-background px-3 py-2 text-sm"
                        placeholder="Título (ej. The Situation)"
                      />
                      <TestimonialSectionEditor
                        sectionKey={`${testimonialForm?.id ?? "new"}-section-${idx}`}
                        value={sec.content}
                        onChange={(html) => {
                          const next = [...(testimonialForm?.sections ?? [])];
                          next[idx] = { ...next[idx]!, title: next[idx]!.title, content: html };
                          setTestimonialForm((f) => (f ? { ...f, sections: next } : null));
                        }}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTestimonialForm((f) => (f ? { ...f, sections: [...(f.sections ?? []), { title: "", content: "" }] } : null))}
                    className="rounded border border-dashed border-[var(--admin-border)] px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
                  >
                    + Añadir sección
                  </button>
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handleSaveTestimonial}
                    disabled={savingTestimonial}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-strong disabled:opacity-50"
                  >
                    {savingTestimonial ? "Saving..." : testimonialForm.id ? "Update" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestimonialForm(null)}
                    className="rounded-lg border border-[var(--admin-border)] px-4 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setTestimonialForm({ image: "", imageAlt: null, category: "", headline: "", ctaText: "Read Full Story", slug: "", summary: "", industry: null, heroImage: null, heroImageAlt: null, highlightedWord: null, metric: null, metricDescription: null, sections: [] })}
                className="rounded-lg border border-dashed border-[var(--admin-border)] px-4 py-3 text-sm font-medium text-[var(--admin-text-muted)] hover:bg-muted hover:border-primary/50"
              >
                + Add testimonial
              </button>
            )}
          </section>
        </main>
      </form>
    </div>
  );
}
