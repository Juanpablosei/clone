"use client";

import { useState, useEffect } from "react";
import ImageUpload from "../../../components/admin/ImageUpload";
import AboutSection from "../../../components/home/AboutSection";
import HomeWhatWeDo from "../../../components/home/HomeWhatWeDo";
import CTASection from "../../../components/home/CTASection";
import AtomicBackground from "../../../components/home/AtomicBackground";
import Image from "next/image";
import Link from "next/link";

interface HomePageData {
  id: string;
  headerTitle: string;
  headerSubtitle: string;
  aboutBadge: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  feature1Title: string;
  feature1Description: string;
  feature2Title: string;
  feature2Description: string;
  feature3Title: string;
  feature3Description: string;
  whatWeDoTitle: string;
  whatWeDoDescription: string;
  card1Title: string;
  card1Description: string;
  card1Link: string;
  card2Title: string;
  card2Description: string;
  card2Link: string;
  card3Title: string;
  card3Description: string;
  card3Link: string;
  ctaText: string;
  ctaButtonText: string;
  serviceImage?: string;
  serviceImageAlt?: string;
  testimonialsBadge?: string;
  testimonialsTitle?: string;
  testimonial1Quote?: string;
  testimonial1Author?: string;
  testimonial1Organization?: string;
  testimonial2Quote?: string;
  testimonial2Author?: string;
  testimonial2Organization?: string;
  testimonial3Quote?: string;
  testimonial3Author?: string;
  testimonial3Organization?: string;
  testimonial4Quote?: string;
  testimonial4Author?: string;
  testimonial4Organization?: string;
  partnersImage?: string;
  partnersTitle?: string;
  partnersDescription?: string;
  partnersCtaText?: string;
  partnersCtaLink?: string;
  partnersSubtitle?: string;
}

export default function HomeAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [pendingAboutImageFile, setPendingAboutImageFile] = useState<File | null>(null);
  const [pendingServiceImageFile, setPendingServiceImageFile] = useState<File | null>(null);
  const [pendingPartnersImageFile, setPendingPartnersImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState<HomePageData>({
    id: "home-page",
    headerTitle: "",
    headerSubtitle: "",
    aboutBadge: "",
    aboutTitle: "",
    aboutDescription: "",
    aboutImage: "",
    feature1Title: "",
    feature1Description: "",
    feature2Title: "",
    feature2Description: "",
    feature3Title: "",
    feature3Description: "",
    whatWeDoTitle: "",
    whatWeDoDescription: "",
    card1Title: "",
    card1Description: "",
    card1Link: "",
    card2Title: "",
    card2Description: "",
    card2Link: "",
    card3Title: "",
    card3Description: "",
    card3Link: "",
    ctaText: "",
    ctaButtonText: "",
    serviceImage: "",
    serviceImageAlt: "",
    testimonialsBadge: "",
    testimonialsTitle: "",
    testimonial1Quote: "",
    testimonial1Author: "",
    testimonial1Organization: "",
    testimonial2Quote: "",
    testimonial2Author: "",
    testimonial2Organization: "",
    testimonial3Quote: "",
    testimonial3Author: "",
    testimonial3Organization: "",
    testimonial4Quote: "",
    testimonial4Author: "",
    testimonial4Organization: "",
    partnersImage: "",
    partnersTitle: "",
    partnersDescription: "",
    partnersCtaText: "",
    partnersCtaLink: "",
    partnersSubtitle: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("/api/admin/home");
      if (response.ok) {
        const data = await response.json();
        setFormData(data);
      }
    } catch (err) {
      console.error("Error fetching home page:", err);
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
      let aboutImageUrl = formData.aboutImage || "";
      let serviceImageUrl = formData.serviceImage || "";
      let partnersImageUrl = formData.partnersImage || "";

      if (pendingAboutImageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", pendingAboutImageFile);
        formDataUpload.append("folder", "home");
        formDataUpload.append("slug", "about");
        if (formData.aboutImage) {
          formDataUpload.append("previousUrl", formData.aboutImage);
        }
        const uploadResponse = await fetch("/api/admin/upload", { method: "POST", body: formDataUpload });
        if (!uploadResponse.ok) {
          const data = await uploadResponse.json().catch(() => ({}));
          setError(data.error || "Error uploading about image");
          return;
        }
        const data = await uploadResponse.json();
        aboutImageUrl = data.path || aboutImageUrl;
      }

      if (pendingServiceImageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", pendingServiceImageFile);
        formDataUpload.append("folder", "home");
        formDataUpload.append("slug", "service");
        if (formData.serviceImage) {
          formDataUpload.append("previousUrl", formData.serviceImage);
        }
        const uploadResponse = await fetch("/api/admin/upload", { method: "POST", body: formDataUpload });
        if (!uploadResponse.ok) {
          const data = await uploadResponse.json().catch(() => ({}));
          setError(data.error || "Error uploading service image");
          return;
        }
        const data = await uploadResponse.json();
        serviceImageUrl = data.path || serviceImageUrl;
      }

      if (pendingPartnersImageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append("file", pendingPartnersImageFile);
        formDataUpload.append("folder", "home");
        formDataUpload.append("slug", "partners");
        if (formData.partnersImage) {
          formDataUpload.append("previousUrl", formData.partnersImage);
        }
        const uploadResponse = await fetch("/api/admin/upload", { method: "POST", body: formDataUpload });
        if (!uploadResponse.ok) {
          const data = await uploadResponse.json().catch(() => ({}));
          setError(data.error || "Error uploading partners image");
          return;
        }
        const data = await uploadResponse.json();
        partnersImageUrl = data.path || partnersImageUrl;
      }

      const payload = {
        ...formData,
        aboutImage: aboutImageUrl,
        serviceImage: serviceImageUrl,
        partnersImage: partnersImageUrl,
      };

      const response = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setFormData(payload);
        setPendingAboutImageFile(null);
        setPendingServiceImageFile(null);
        setPendingPartnersImageFile(null);
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
          <h1 className="text-xl font-semibold text-[var(--admin-text)]">Home Page Editor</h1>
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
        {/* Header Section */}
        <section
          className="relative flex w-full items-center overflow-hidden border-b border-primary/20"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            background: "linear-gradient(to right, rgba(91, 125, 214, 0.8), rgba(91, 125, 214, 0.3))",
            height: "600px",
          }}
        >
          <AtomicBackground />
          <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center justify-center">
            <div className="w-full px-6 text-center sm:px-10 lg:px-16" style={{ transform: "translateY(-60px)" }}>
              <input
                type="text"
                value={formData.headerTitle}
                onChange={(e) => setFormData({ ...formData, headerTitle: e.target.value })}
                className="w-full max-w-6xl mx-auto bg-transparent text-center text-4xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-5xl lg:text-6xl"
                placeholder="Header Title"
              />
            </div>
          </div>
          <div className="absolute bottom-4 left-0 right-0 z-10">
            <div className="mx-auto w-full max-w-[1600px]">
              <div className="px-6 text-center sm:px-10 lg:px-16">
                <textarea
                  value={formData.headerSubtitle}
                  onChange={(e) => setFormData({ ...formData, headerSubtitle: e.target.value })}
                  className="w-full bg-transparent text-center text-sm font-medium uppercase tracking-widest text-foreground/80 outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-base"
                  placeholder="Header Subtitle"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section
          className="relative flex flex-col overflow-hidden lg:flex-row"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          <div className="w-full lg:w-1/2 bg-surface flex items-center">
            <div className="w-full max-w-[800px] ml-auto flex flex-col gap-8 p-8 sm:p-10 lg:p-12">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <input
                    type="text"
                    value={formData.aboutBadge}
                    onChange={(e) => setFormData({ ...formData, aboutBadge: e.target.value })}
                    className="inline-flex w-fit items-center gap-2 rounded-full bg-[#e6f4ff] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="Badge"
                  />
                  <input
                    type="text"
                    value={formData.aboutTitle}
                    onChange={(e) => setFormData({ ...formData, aboutTitle: e.target.value })}
                    className="w-full bg-transparent text-3xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                    placeholder="About Title"
                  />
                </div>
                <div className="h-px w-16 bg-gradient-to-r from-primary to-transparent" />
                <textarea
                  value={formData.aboutDescription}
                  onChange={(e) => setFormData({ ...formData, aboutDescription: e.target.value })}
                  className="w-full bg-transparent text-base leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-lg"
                  placeholder="About Description"
                  rows={4}
                />
              </div>

              {/* Features */}
              <div className="flex flex-col gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="text"
                      value={formData.feature1Title}
                      onChange={(e) => setFormData({ ...formData, feature1Title: e.target.value })}
                      className="w-full bg-transparent text-lg font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                      placeholder="Feature 1 Title"
                    />
                    <textarea
                      value={formData.feature1Description}
                      onChange={(e) => setFormData({ ...formData, feature1Description: e.target.value })}
                      className="w-full bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                      placeholder="Feature 1 Description"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="text"
                      value={formData.feature2Title}
                      onChange={(e) => setFormData({ ...formData, feature2Title: e.target.value })}
                      className="w-full bg-transparent text-lg font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                      placeholder="Feature 2 Title"
                    />
                    <textarea
                      value={formData.feature2Description}
                      onChange={(e) => setFormData({ ...formData, feature2Description: e.target.value })}
                      className="w-full bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                      placeholder="Feature 2 Description"
                      rows={2}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <input
                      type="text"
                      value={formData.feature3Title}
                      onChange={(e) => setFormData({ ...formData, feature3Title: e.target.value })}
                      className="w-full bg-transparent text-lg font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                      placeholder="Feature 3 Title"
                    />
                    <textarea
                      value={formData.feature3Description}
                      onChange={(e) => setFormData({ ...formData, feature3Description: e.target.value })}
                      className="w-full bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                      placeholder="Feature 3 Description"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Imagen editable */}
          <div className="relative h-[500px] w-full overflow-hidden lg:h-auto lg:flex-1 group">
            {formData.aboutImage ? (
              <Image
                src={formData.aboutImage}
                alt="About"
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-muted">
                <p className="text-muted-foreground">No image</p>
              </div>
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <ImageUpload
                  value={formData.aboutImage}
                  onChange={(url) => setFormData({ ...formData, aboutImage: url || "" })}
                  onFileSelect={(file) => setPendingAboutImageFile(file)}
                  folder="home"
                  slug="about"
                  label=""
                  autoUpload={false}
                  previewSize="xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section
          className="bg-primary/5 py-16 text-foreground md:py-24"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
            <div className="mb-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
              <div>
                <input
                  type="text"
                  value={formData.whatWeDoTitle}
                  onChange={(e) => setFormData({ ...formData, whatWeDoTitle: e.target.value })}
                  className="w-full bg-transparent text-3xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                  placeholder="What We Do Title"
                />
              </div>
              <div>
                <textarea
                  value={formData.whatWeDoDescription}
                  onChange={(e) => setFormData({ ...formData, whatWeDoDescription: e.target.value })}
                  className="w-full bg-transparent text-lg leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-xl"
                  placeholder="What We Do Description"
                  rows={4}
                />
              </div>
            </div>

            {/* Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="group bg-background p-8 transition">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={formData.card1Title}
                  onChange={(e) => setFormData({ ...formData, card1Title: e.target.value })}
                  className="mb-3 w-full bg-transparent text-xl font-semibold text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Card 1 Title"
                />
                <textarea
                  value={formData.card1Description}
                  onChange={(e) => setFormData({ ...formData, card1Description: e.target.value })}
                  className="mb-6 w-full bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Card 1 Description"
                  rows={4}
                />
                <input
                  type="text"
                  value={formData.card1Link}
                  onChange={(e) => setFormData({ ...formData, card1Link: e.target.value })}
                  className="w-full bg-transparent text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 outline-none ring-2 ring-transparent hover:decoration-primary hover:ring-primary/50 focus:ring-primary"
                  placeholder="Card 1 Link"
                />
              </div>

              <div className="group bg-background p-8 transition">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={formData.card2Title}
                  onChange={(e) => setFormData({ ...formData, card2Title: e.target.value })}
                  className="mb-3 w-full bg-transparent text-xl font-semibold text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Card 2 Title"
                />
                <textarea
                  value={formData.card2Description}
                  onChange={(e) => setFormData({ ...formData, card2Description: e.target.value })}
                  className="mb-6 w-full bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Card 2 Description"
                  rows={4}
                />
                <input
                  type="text"
                  value={formData.card2Link}
                  onChange={(e) => setFormData({ ...formData, card2Link: e.target.value })}
                  className="w-full bg-transparent text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 outline-none ring-2 ring-transparent hover:decoration-primary hover:ring-primary/50 focus:ring-primary"
                  placeholder="Card 2 Link"
                />
              </div>

              <div className="group bg-background p-8 transition">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={formData.card3Title}
                  onChange={(e) => setFormData({ ...formData, card3Title: e.target.value })}
                  className="mb-3 w-full bg-transparent text-xl font-semibold text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Card 3 Title"
                />
                <textarea
                  value={formData.card3Description}
                  onChange={(e) => setFormData({ ...formData, card3Description: e.target.value })}
                  className="mb-6 w-full bg-transparent text-sm leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Card 3 Description"
                  rows={4}
                />
                <input
                  type="text"
                  value={formData.card3Link}
                  onChange={(e) => setFormData({ ...formData, card3Link: e.target.value })}
                  className="w-full bg-transparent text-sm font-semibold text-primary underline decoration-primary/30 underline-offset-4 outline-none ring-2 ring-transparent hover:decoration-primary hover:ring-primary/50 focus:ring-primary"
                  placeholder="Card 3 Link"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ServiceSlideNewSection */}
        <section
          className="relative h-[600px] w-full overflow-hidden sm:h-[700px] lg:h-[800px] group"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
          }}
        >
          {formData.serviceImage ? (
            <Image
              src={formData.serviceImage}
              alt={formData.serviceImageAlt || "Service"}
              fill
              className="object-cover"
              priority
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
                  value={formData.serviceImage || ""}
                  onChange={(url) => setFormData({ ...formData, serviceImage: url || "" })}
                  onFileSelect={(file) => setPendingServiceImageFile(file)}
                  folder="home"
                  slug="service"
                  label=""
                  autoUpload={false}
                  previewSize="xl"
                />
                <input
                  type="text"
                  value={formData.serviceImageAlt || ""}
                  onChange={(e) => setFormData({ ...formData, serviceImageAlt: e.target.value })}
                  className="mt-2 w-full rounded border border-gray-300 px-2 py-1 text-sm"
                  placeholder="Image Alt Text (for SEO)"
                />
              </div>
            </div>
          </div>
        </section>

        {/* TestimonialsSection */}
        <section className="py-16 text-foreground md:py-24">
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
            <div className="mb-12 flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-4">
                <input
                  type="text"
                  value={formData.testimonialsBadge || ""}
                  onChange={(e) => setFormData({ ...formData, testimonialsBadge: e.target.value })}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary-strong outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Badge"
                />
                <input
                  type="text"
                  value={formData.testimonialsTitle || ""}
                  onChange={(e) => setFormData({ ...formData, testimonialsTitle: e.target.value })}
                  className="w-full max-w-3xl text-center bg-transparent text-3xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                  placeholder="Testimonials Title"
                />
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Testimonial 1 */}
              <div className="flex flex-col gap-4 bg-primary/10 p-6">
                <div className="text-5xl font-serif leading-none text-primary">&ldquo;</div>
                <textarea
                  value={formData.testimonial1Quote || ""}
                  onChange={(e) => setFormData({ ...formData, testimonial1Quote: e.target.value })}
                  className="flex-1 bg-transparent text-sm leading-relaxed text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Quote 1"
                  rows={4}
                />
                <div className="flex flex-col gap-1 pt-4">
                  <input
                    type="text"
                    value={formData.testimonial1Author || ""}
                    onChange={(e) => setFormData({ ...formData, testimonial1Author: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="Author 1"
                  />
                  <input
                    type="text"
                    value={formData.testimonial1Organization || ""}
                    onChange={(e) => setFormData({ ...formData, testimonial1Organization: e.target.value })}
                    className="w-full bg-transparent text-xs text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="Organization 1"
                  />
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="flex flex-col gap-4 bg-primary/10 p-6">
                <div className="text-5xl font-serif leading-none text-primary">&ldquo;</div>
                <textarea
                  value={formData.testimonial2Quote || ""}
                  onChange={(e) => setFormData({ ...formData, testimonial2Quote: e.target.value })}
                  className="flex-1 bg-transparent text-sm leading-relaxed text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Quote 2"
                  rows={4}
                />
                <div className="flex flex-col gap-1 pt-4">
                  <input
                    type="text"
                    value={formData.testimonial2Author || ""}
                    onChange={(e) => setFormData({ ...formData, testimonial2Author: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="Author 2"
                  />
                  <input
                    type="text"
                    value={formData.testimonial2Organization || ""}
                    onChange={(e) => setFormData({ ...formData, testimonial2Organization: e.target.value })}
                    className="w-full bg-transparent text-xs text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="Organization 2"
                  />
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="flex flex-col gap-4 bg-primary/10 p-6">
                <div className="text-5xl font-serif leading-none text-primary">&ldquo;</div>
                <textarea
                  value={formData.testimonial3Quote || ""}
                  onChange={(e) => setFormData({ ...formData, testimonial3Quote: e.target.value })}
                  className="flex-1 bg-transparent text-sm leading-relaxed text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Quote 3"
                  rows={4}
                />
                <div className="flex flex-col gap-1 pt-4">
                  <input
                    type="text"
                    value={formData.testimonial3Author || ""}
                    onChange={(e) => setFormData({ ...formData, testimonial3Author: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="Author 3"
                  />
                  <input
                    type="text"
                    value={formData.testimonial3Organization || ""}
                    onChange={(e) => setFormData({ ...formData, testimonial3Organization: e.target.value })}
                    className="w-full bg-transparent text-xs text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="Organization 3"
                  />
                </div>
              </div>

              {/* Testimonial 4 */}
              <div className="flex flex-col gap-4 bg-primary/10 p-6">
                <div className="text-5xl font-serif leading-none text-primary">&ldquo;</div>
                <textarea
                  value={formData.testimonial4Quote || ""}
                  onChange={(e) => setFormData({ ...formData, testimonial4Quote: e.target.value })}
                  className="flex-1 bg-transparent text-sm leading-relaxed text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Quote 4"
                  rows={4}
                />
                <div className="flex flex-col gap-1 pt-4">
                  <input
                    type="text"
                    value={formData.testimonial4Author || ""}
                    onChange={(e) => setFormData({ ...formData, testimonial4Author: e.target.value })}
                    className="w-full bg-transparent text-sm font-semibold text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="Author 4"
                  />
                  <input
                    type="text"
                    value={formData.testimonial4Organization || ""}
                    onChange={(e) => setFormData({ ...formData, testimonial4Organization: e.target.value })}
                    className="w-full bg-transparent text-xs text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="Organization 4"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PartnersSection */}
        <section className="relative text-foreground">
          <div className="grid lg:grid-cols-2 lg:items-stretch">
            {/* Left Side - Image (extends to left edge) */}
            <div
              className="relative order-1 h-[400px] lg:order-1 lg:h-auto group"
              style={{
                marginLeft: "calc(-50vw + 50%)",
              }}
            >
              {formData.partnersImage ? (
                <Image
                  src={formData.partnersImage}
                  alt="Partners"
                  fill
                  className="object-cover"
                  priority
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
                      value={formData.partnersImage || ""}
                      onChange={(url) => setFormData({ ...formData, partnersImage: url || "" })}
                      onFileSelect={(file) => setPendingPartnersImageFile(file)}
                      folder="home"
                      slug="partners"
                      label=""
                      autoUpload={false}
                      previewSize="xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Content */}
            <div className="relative z-10 order-2 bg-background px-6 py-16 sm:px-10 md:py-24 lg:order-2 lg:px-16">
              <div className="flex flex-col gap-8 py-16 md:py-24">
                {/* Title */}
                <input
                  type="text"
                  value={formData.partnersTitle || ""}
                  onChange={(e) => setFormData({ ...formData, partnersTitle: e.target.value })}
                  className="w-full bg-transparent text-3xl font-semibold leading-tight text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary sm:text-4xl lg:text-5xl"
                  placeholder="Partners Title"
                />

                {/* Description */}
                <textarea
                  value={formData.partnersDescription || ""}
                  onChange={(e) => setFormData({ ...formData, partnersDescription: e.target.value })}
                  className="w-full bg-transparent text-base leading-relaxed text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Partners Description"
                  rows={6}
                />

                {/* CTA Section */}
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    value={formData.partnersCtaText || ""}
                    onChange={(e) => setFormData({ ...formData, partnersCtaText: e.target.value })}
                    className="w-full bg-transparent text-base font-medium text-foreground outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                    placeholder="CTA Text"
                  />
                  <input
                    type="text"
                    value={formData.partnersCtaLink || ""}
                    onChange={(e) => setFormData({ ...formData, partnersCtaLink: e.target.value })}
                    className="w-fit rounded-full border border-border bg-surface px-6 py-3 text-sm font-semibold text-foreground outline-none ring-2 ring-transparent hover:border-primary hover:text-primary-strong hover:ring-primary/50 focus:ring-primary"
                    placeholder="CTA Link"
                  />
                </div>

                {/* Subtitle */}
                <input
                  type="text"
                  value={formData.partnersSubtitle || ""}
                  onChange={(e) => setFormData({ ...formData, partnersSubtitle: e.target.value })}
                  className="w-full bg-transparent text-sm font-semibold uppercase tracking-[0.08em] text-muted outline-none ring-2 ring-transparent hover:ring-primary/50 focus:ring-primary"
                  placeholder="Partners Subtitle"
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          className="py-12 text-foreground md:py-20 lg:py-24"
          style={{
            width: "100vw",
            marginLeft: "calc(-50vw + 50%)",
            background: "linear-gradient(to right, rgba(91, 125, 214, 0.8), rgba(91, 125, 214, 0.3))",
          }}
        >
          <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
            <div className="flex min-h-[300px] items-end gap-6 rounded-3xl px-8 pb-8 lg:min-h-[350px] lg:px-12 lg:pb-10">
              <textarea
                value={formData.ctaText}
                onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                className="w-[40%] bg-transparent text-3xl font-semibold leading-tight text-white outline-none ring-2 ring-transparent hover:ring-white/50 focus:ring-white sm:text-4xl lg:text-5xl"
                placeholder="CTA Text"
                rows={2}
              />
              <div className="flex-1" />
              <input
                type="text"
                value={formData.ctaButtonText}
                onChange={(e) => setFormData({ ...formData, ctaButtonText: e.target.value })}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md outline-none ring-2 ring-transparent hover:opacity-90 hover:ring-white/50 focus:ring-white"
                placeholder="Button Text"
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
