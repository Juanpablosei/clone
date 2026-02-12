"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../../../components/admin/ImageUpload";
import Image from "next/image";
import AtomicBackground from "../../../components/home/AtomicBackground";

interface AccordionItem {
  title: string;
  content?: string;
}

interface AdvisoryPageData {
  id: string;
  heroTitle?: string | null;
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
  advisoryCard1Title?: string | null;
  advisoryCard1Description?: string | null;
  advisoryCard1ExampleQ?: string | null;
  advisoryCard1Expert?: string | null;
  advisoryCard1Format?: string | null;
  advisoryCard1CtaText?: string | null;
  advisoryCard1CtaUrl?: string | null;
  advisoryCard2Title?: string | null;
  advisoryCard2Description?: string | null;
  advisoryCard2Ongoing?: string | null;
  advisoryCard2DeepDive?: string | null;
  advisoryCard2Benchmarks?: string | null;
  advisoryCard2CtaText?: string | null;
  advisoryCard2CtaLink?: string | null;
}

const API = "/api/admin/advisory-page";
const IMAGE_FOLDER = "resources";
const IMAGE_SLUG = "advisory-content";

const DEFAULT_DATA: AdvisoryPageData = {
  id: "advisory-page",
  heroTitle: "Advisory & Guidance",
  introBadge: "Advisory & Guidance",
  introTitle: "Work with our AI experts",
  introDescription:
    "We bring scientific and policy insight into real decisions. Our advisory and guidance helps governments, organisations, and civil society understand trade-offs, clarify options, and move forward thoughtfully as AI reshapes their environment.",
  accordionItems: [
    { title: "Expert briefings", content: "Focused sessions with our researchers and practitioners on capability, safety, and sociotechnical impact." },
    { title: "Tailored consultations", content: "Ongoing support for strategy, governance, and responsible deployment aligned with your context." },
    { title: "Workshops and training", content: "Practical sessions to build judgment and capability within your organisation." },
  ],
  features: [
    "Policy and governance guidance",
    "Technical and safety assessment",
    "Stakeholder alignment",
    "Responsible deployment support",
  ],
  contentImage: "/Professional_Discussion.png",
  contentImageAlt: "Advisory and guidance",
  contentBadge: "HOW WE WORK",
  contentTitle: "Clarity when decisions matter",
  contentDescription:
    "We work with you to cut through hype and uncertainty, so choices are informed by evidence and judgment, not pressure or assumptions.",
  iconType: "chart",
  advisoryCard1Title: "1-hour expert call",
  advisoryCard1Description:
    "Focused sessions with our researchers and practitioners on capability, safety, and sociotechnical impact.",
  advisoryCard1ExampleQ:
    "Clarify specific risks, limits, or opportunities; discuss how our research applies to your context; explore governance or deployment options.",
  advisoryCard1Expert: "Direct access to Gradient researchers and practitioners.",
  advisoryCard1Format: "1-hour video call, with optional pre-read or follow-up note.",
  advisoryCard1CtaText: "Book a briefing",
  advisoryCard1CtaUrl: "https://calendar.google.com/calendar/u/0/appointments/schedules",
  advisoryCard2Title: "Tailored consultations",
  advisoryCard2Description:
    "Ongoing support for strategy, governance, and responsible deployment aligned with your context.",
  advisoryCard2Ongoing: "Regular briefings and structured updates on capability, safety, and policy.",
  advisoryCard2DeepDive: "Focused projects on risk assessment, benchmarks, or governance design.",
  advisoryCard2Benchmarks: "Custom evaluation or benchmarking to support your decisions.",
  advisoryCard2CtaText: "Start a conversation",
  advisoryCard2CtaLink: "/contact-us",
};

export default function AdvisoryAdminPage() {
  const [contentLoading, setContentLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pendingContentImageFile, setPendingContentImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<AdvisoryPageData>(DEFAULT_DATA);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(API);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          id: data.id || "advisory-page",
          heroTitle: data.heroTitle ?? DEFAULT_DATA.heroTitle,
          introBadge: data.introBadge ?? DEFAULT_DATA.introBadge,
          introTitle: data.introTitle ?? DEFAULT_DATA.introTitle,
          introDescription: data.introDescription ?? DEFAULT_DATA.introDescription,
          accordionItems: Array.isArray(data.accordionItems) ? data.accordionItems : DEFAULT_DATA.accordionItems ?? null,
          features: Array.isArray(data.features) ? data.features : DEFAULT_DATA.features ?? null,
          contentImage: data.contentImage ?? DEFAULT_DATA.contentImage,
          contentImageAlt: data.contentImageAlt ?? DEFAULT_DATA.contentImageAlt,
          contentBadge: data.contentBadge ?? DEFAULT_DATA.contentBadge,
          contentTitle: data.contentTitle ?? DEFAULT_DATA.contentTitle,
          contentDescription: data.contentDescription ?? DEFAULT_DATA.contentDescription,
          iconType: data.iconType ?? DEFAULT_DATA.iconType,
          advisoryCard1Title: data.advisoryCard1Title ?? DEFAULT_DATA.advisoryCard1Title,
          advisoryCard1Description: data.advisoryCard1Description ?? DEFAULT_DATA.advisoryCard1Description,
          advisoryCard1ExampleQ: data.advisoryCard1ExampleQ ?? DEFAULT_DATA.advisoryCard1ExampleQ,
          advisoryCard1Expert: data.advisoryCard1Expert ?? DEFAULT_DATA.advisoryCard1Expert,
          advisoryCard1Format: data.advisoryCard1Format ?? DEFAULT_DATA.advisoryCard1Format,
          advisoryCard1CtaText: data.advisoryCard1CtaText ?? DEFAULT_DATA.advisoryCard1CtaText,
          advisoryCard1CtaUrl: data.advisoryCard1CtaUrl ?? DEFAULT_DATA.advisoryCard1CtaUrl,
          advisoryCard2Title: data.advisoryCard2Title ?? DEFAULT_DATA.advisoryCard2Title,
          advisoryCard2Description: data.advisoryCard2Description ?? DEFAULT_DATA.advisoryCard2Description,
          advisoryCard2Ongoing: data.advisoryCard2Ongoing ?? DEFAULT_DATA.advisoryCard2Ongoing,
          advisoryCard2DeepDive: data.advisoryCard2DeepDive ?? DEFAULT_DATA.advisoryCard2DeepDive,
          advisoryCard2Benchmarks: data.advisoryCard2Benchmarks ?? DEFAULT_DATA.advisoryCard2Benchmarks,
          advisoryCard2CtaText: data.advisoryCard2CtaText ?? DEFAULT_DATA.advisoryCard2CtaText,
          advisoryCard2CtaLink: data.advisoryCard2CtaLink ?? DEFAULT_DATA.advisoryCard2CtaLink,
        });
      }
    } catch (err) {
      console.error("Error fetching advisory page:", err);
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

  const renderChartIcon = () => (
    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );

  if (contentLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra fija: edición */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 px-6 py-3 shadow-sm backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Editing: Advisory & Guidance</span>
          <div className="flex items-center gap-4">
            {error && <span className="rounded bg-red-100 px-2 py-1 text-xs text-red-700">{error}</span>}
            {success && <span className="rounded bg-green-100 px-2 py-1 text-xs text-green-700">Saved</span>}
            <button
              type="submit"
              form="advisory-form"
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>

      <form id="advisory-form" onSubmit={handleSubmit} className="contents">
        {/* Hero editable: mismo aspecto que Hero, título editando */}
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
            <div className="w-full max-w-4xl px-6 text-center sm:px-10 lg:px-16">
              <input
                type="text"
                value={formData.heroTitle ?? ""}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full bg-transparent text-center text-4xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent placeholder:text-foreground/70 focus:ring-white/50 sm:text-5xl lg:text-6xl"
                placeholder="Advisory & Guidance"
              />
            </div>
          </div>
        </section>

        <main className="mx-auto flex max-w-[1600px] flex-col gap-20 px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
          {/* 1) Intro Section – mismo layout que IntroSection, editable */}
          <section className="flex flex-col gap-12 pb-8">
            <input
              type="text"
              value={formData.introBadge ?? ""}
              onChange={(e) => setFormData({ ...formData, introBadge: e.target.value })}
              className="inline-flex w-fit items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary outline-none ring-2 ring-transparent focus:ring-primary"
              placeholder="Badge"
            />
            <div className="flex flex-col gap-12">
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="lg:w-[70%]">
                  <input
                    type="text"
                    value={formData.introTitle ?? ""}
                    onChange={(e) => setFormData({ ...formData, introTitle: e.target.value })}
                    className="w-full bg-transparent text-3xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent focus:ring-primary sm:text-4xl lg:text-5xl"
                    placeholder="Title"
                  />
                </div>
                <div className="hidden lg:block" />
              </div>
              <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 lg:items-start">
                <div className="lg:w-[70%]">
                  <textarea
                    value={formData.introDescription ?? ""}
                    onChange={(e) => setFormData({ ...formData, introDescription: e.target.value })}
                    className="w-full min-h-[120px] resize-y bg-transparent text-base leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary sm:text-lg"
                    placeholder="Description"
                    rows={4}
                  />
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-col divide-y divide-border">
                    {accordionItems.map((item, index) => (
                      <div key={index} className="py-4 first:pt-0 last:pb-0">
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => {
                            const next = [...accordionItems];
                            next[index] = { ...next[index], title: e.target.value };
                            setFormData({ ...formData, accordionItems: next });
                          }}
                          className="mb-2 w-full bg-transparent text-lg font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent focus:ring-primary"
                          placeholder="Accordion title"
                        />
                        <textarea
                          value={item.content ?? ""}
                          onChange={(e) => {
                            const next = [...accordionItems];
                            next[index] = { ...next[index], content: e.target.value };
                            setFormData({ ...formData, accordionItems: next });
                          }}
                          className="w-full min-h-[60px] resize-y bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary"
                          placeholder="Accordion content"
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
                    className="mt-4 rounded-lg border border-border bg-muted/30 px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50"
                  >
                    + Add accordion item
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 border-t border-border pt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2"
                >
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => {
                      const next = [...features];
                      next[index] = e.target.value;
                      setFormData({ ...formData, features: next });
                    }}
                    className="min-w-[120px] bg-transparent text-base text-foreground outline-none ring-2 ring-transparent focus:ring-primary"
                    placeholder="Feature"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        features: features.filter((_, i) => i !== index),
                      })
                    }
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, features: [...features, ""] })}
                className="rounded-full border border-border bg-surface px-4 py-2 text-base text-foreground hover:bg-muted/50"
              >
                + Add feature
              </button>
            </div>
          </section>

          {/* 2) Image Content Section – mismo layout que ImageContentSection, editable */}
          <section className="relative flex h-[80vh] flex-col overflow-hidden rounded-3xl lg:flex-row gap-4">
            <div className="relative h-full w-full overflow-hidden rounded-3xl lg:w-1/2">
              {formData.contentImage ? (
                <div className="group relative h-full w-full">
                  <Image
                    src={formData.contentImage}
                    alt={formData.contentImageAlt ?? "Content"}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <ImageUpload
                      value={formData.contentImage}
                      onChange={(url) => setFormData({ ...formData, contentImage: url ?? null })}
                      onFileSelect={(file) => setPendingContentImageFile(file)}
                      folder={IMAGE_FOLDER}
                      slug={IMAGE_SLUG}
                      className="text-white"
                      autoUpload={false}
                      previewSize="xl"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-3xl border-2 border-dashed border-muted-foreground/30">
                  <ImageUpload
                    value={null}
                    onChange={(url) => setFormData({ ...formData, contentImage: url ?? null })}
                    onFileSelect={(file) => setPendingContentImageFile(file)}
                    folder={IMAGE_FOLDER}
                    slug={IMAGE_SLUG}
                    autoUpload={false}
                    previewSize="xl"
                  />
                </div>
              )}
            </div>
            <div className="relative flex h-full w-full flex-col justify-between rounded-3xl bg-primary/10 lg:w-1/2 lg:bg-primary/15">
              <div className="relative flex flex-col gap-6 p-8 sm:p-10 lg:p-12">
                <input
                  type="text"
                  value={formData.contentBadge ?? ""}
                  onChange={(e) => setFormData({ ...formData, contentBadge: e.target.value })}
                  className="inline-flex w-fit items-center rounded-full bg-primary/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary outline-none ring-2 ring-transparent focus:ring-primary"
                  placeholder="Badge"
                />
                <div className="absolute right-8 top-8 flex items-center gap-2 sm:right-10 sm:top-10">
                  {formData.iconType === "chart" && (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white">
                      {renderChartIcon()}
                    </div>
                  )}
                  <select
                    value={formData.iconType ?? ""}
                    onChange={(e) => setFormData({ ...formData, iconType: e.target.value || null })}
                    className="rounded-lg border border-white/30 bg-white/10 px-2 py-1.5 text-sm text-white outline-none focus:ring-2 focus:ring-white"
                    title="Icon"
                  >
                    <option value="">Sin icono</option>
                    <option value="chart">Chart</option>
                  </select>
                </div>
                <input
                  type="text"
                  value={formData.contentTitle ?? ""}
                  onChange={(e) => setFormData({ ...formData, contentTitle: e.target.value })}
                  className="w-full bg-transparent text-3xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent focus:ring-primary sm:text-4xl lg:text-5xl"
                  placeholder="Title"
                />
              </div>
              <div className="p-8 sm:p-10 lg:p-12 lg:pt-0">
                <textarea
                  value={formData.contentDescription ?? ""}
                  onChange={(e) => setFormData({ ...formData, contentDescription: e.target.value })}
                  className="w-full min-h-[100px] resize-y bg-transparent text-base leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary sm:text-lg lg:w-[70%]"
                  placeholder="Description"
                  rows={4}
                />
                <input
                  type="text"
                  value={formData.contentImageAlt ?? ""}
                  onChange={(e) => setFormData({ ...formData, contentImageAlt: e.target.value })}
                  className="mt-2 w-full rounded border border-border bg-background/50 px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary lg:w-[70%]"
                  placeholder="Image alt (SEO)"
                />
              </div>
            </div>
          </section>

          {/* 3) Advisory Section – mismo layout que AdvisorySection, editable */}
          <section className="mx-auto w-full max-w-[1600px]">
            <div className="flex flex-col gap-12">
              <div className="grid gap-8 sm:grid-cols-2 lg:gap-12">
                {/* Card 1 */}
                <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-8">
                  <input
                    type="text"
                    value={formData.advisoryCard1Title ?? ""}
                    onChange={(e) => setFormData({ ...formData, advisoryCard1Title: e.target.value })}
                    className="w-full bg-transparent text-2xl font-semibold text-foreground outline-none ring-2 ring-transparent focus:ring-primary sm:text-3xl"
                    placeholder="Card 1 title"
                  />
                  <textarea
                    value={formData.advisoryCard1Description ?? ""}
                    onChange={(e) => setFormData({ ...formData, advisoryCard1Description: e.target.value })}
                    className="min-h-[60px] w-full resize-y bg-transparent text-base leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary"
                    placeholder="Description"
                    rows={2}
                  />
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="mb-2 block font-semibold text-foreground">Example questions:</span>
                      <textarea
                        value={formData.advisoryCard1ExampleQ ?? ""}
                        onChange={(e) => setFormData({ ...formData, advisoryCard1ExampleQ: e.target.value })}
                        className="min-h-[60px] w-full resize-y bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary"
                        rows={2}
                      />
                    </div>
                    <div>
                      <span className="mb-2 block font-semibold text-foreground">Expert access:</span>
                      <textarea
                        value={formData.advisoryCard1Expert ?? ""}
                        onChange={(e) => setFormData({ ...formData, advisoryCard1Expert: e.target.value })}
                        className="min-h-[50px] w-full resize-y bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary"
                        rows={2}
                      />
                    </div>
                    <div>
                      <span className="mb-2 block font-semibold text-foreground">The format:</span>
                      <textarea
                        value={formData.advisoryCard1Format ?? ""}
                        onChange={(e) => setFormData({ ...formData, advisoryCard1Format: e.target.value })}
                        className="min-h-[50px] w-full resize-y bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <input
                      type="text"
                      value={formData.advisoryCard1CtaText ?? ""}
                      onChange={(e) => setFormData({ ...formData, advisoryCard1CtaText: e.target.value })}
                      className="flex-1 rounded-lg border border-border bg-background/50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      placeholder="CTA text"
                    />
                    <input
                      type="text"
                      value={formData.advisoryCard1CtaUrl ?? ""}
                      onChange={(e) => setFormData({ ...formData, advisoryCard1CtaUrl: e.target.value })}
                      className="flex-1 rounded-lg border border-border bg-background/50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      placeholder="CTA URL"
                    />
                  </div>
                </div>

                {/* Card 2 */}
                <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface p-8">
                  <input
                    type="text"
                    value={formData.advisoryCard2Title ?? ""}
                    onChange={(e) => setFormData({ ...formData, advisoryCard2Title: e.target.value })}
                    className="w-full bg-transparent text-2xl font-semibold text-foreground outline-none ring-2 ring-transparent focus:ring-primary sm:text-3xl"
                    placeholder="Card 2 title"
                  />
                  <textarea
                    value={formData.advisoryCard2Description ?? ""}
                    onChange={(e) => setFormData({ ...formData, advisoryCard2Description: e.target.value })}
                    className="min-h-[60px] w-full resize-y bg-transparent text-base leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary"
                    placeholder="Description"
                    rows={2}
                  />
                  <div className="flex flex-col gap-4">
                    <div>
                      <span className="mb-2 block font-semibold text-foreground">Ongoing intelligence:</span>
                      <textarea
                        value={formData.advisoryCard2Ongoing ?? ""}
                        onChange={(e) => setFormData({ ...formData, advisoryCard2Ongoing: e.target.value })}
                        className="min-h-[50px] w-full resize-y bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary"
                        rows={2}
                      />
                    </div>
                    <div>
                      <span className="mb-2 block font-semibold text-foreground">Deep-dive projects:</span>
                      <textarea
                        value={formData.advisoryCard2DeepDive ?? ""}
                        onChange={(e) => setFormData({ ...formData, advisoryCard2DeepDive: e.target.value })}
                        className="min-h-[50px] w-full resize-y bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary"
                        rows={2}
                      />
                    </div>
                    <div>
                      <span className="mb-2 block font-semibold text-foreground">Custom benchmarks:</span>
                      <textarea
                        value={formData.advisoryCard2Benchmarks ?? ""}
                        onChange={(e) => setFormData({ ...formData, advisoryCard2Benchmarks: e.target.value })}
                        className="min-h-[50px] w-full resize-y bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent focus:ring-primary"
                        rows={2}
                      />
                    </div>
                  </div>
                  <div className="mt-auto flex gap-2">
                    <input
                      type="text"
                      value={formData.advisoryCard2CtaText ?? ""}
                      onChange={(e) => setFormData({ ...formData, advisoryCard2CtaText: e.target.value })}
                      className="flex-1 rounded-lg border border-border bg-background/50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      placeholder="CTA text"
                    />
                    <input
                      type="text"
                      value={formData.advisoryCard2CtaLink ?? ""}
                      onChange={(e) => setFormData({ ...formData, advisoryCard2CtaLink: e.target.value })}
                      className="flex-1 rounded-lg border border-border bg-background/50 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                      placeholder="CTA link (ej. /contact-us)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </form>
    </div>
  );
}
