"use client";

import { useState, FormEvent } from "react";
import type { Resource } from "./ResourcesSection";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: Resource;
  onSubmit: (name: string, email: string) => void;
}

export default function DownloadModal({
  isOpen,
  onClose,
  resource,
  onSubmit,
}: DownloadModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/resource-downloads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          resourceTitle: resource.title,
        }),
      });

      if (response.ok) {
        onSubmit(name, email);
        setName("");
        setEmail("");
      } else {
        console.error("Error saving download");
        // Aún permitir la descarga aunque falle el guardado
        onSubmit(name, email);
        setName("");
        setEmail("");
      }
    } catch (error) {
      console.error("Error:", error);
      // Aún permitir la descarga aunque falle el guardado
      onSubmit(name, email);
      setName("");
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted transition hover:bg-background"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="mb-6">
          <h2 className="mb-2 text-2xl font-semibold text-foreground">
            Download Resource
          </h2>
          <p className="text-sm text-muted">
            Please provide your information to download{" "}
            <span className="font-semibold text-foreground">
              {resource.title}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-primary focus:outline-none"
              placeholder="Enter your email address"
            />
          </div>

          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-background"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !email.trim()}
              className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Processing..." : "Download"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

