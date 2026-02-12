"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmModal from "./ConfirmModal";

interface ConfigFormProps {
  initialData: {
    email?: string | null;
    linkedin?: string | null;
    twitter?: string | null;
  } | null;
}

export default function ConfigForm({ initialData }: ConfigFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: initialData?.email || "",
    linkedin: initialData?.linkedin || "",
    twitter: initialData?.twitter || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate that passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    // Validate minimum length
    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setSuccessModalOpen(true);
      } else {
        setError(data.error || "Error changing password");
      }
    } catch (error) {
      setError("Error changing password");
    } finally {
      setLoading(false);
    }
  };

  const handleConfigSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.refresh();
        setSuccessModalOpen(true);
      } else {
        setError("Error updating configuration");
      }
    } catch (error) {
      setError("Error updating configuration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Password Change Form */}
      <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-8 mb-6">
        <h2 className="text-xl font-semibold text-[var(--admin-text)] mb-6">Change Password</h2>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--admin-text)]">
              Current Password
            </label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2.5 text-[var(--admin-text)] focus:border-primary focus:outline-none"
              placeholder="Enter your current password"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--admin-text)]">
              New Password
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2.5 text-[var(--admin-text)] focus:border-primary focus:outline-none"
              placeholder="Enter your new password"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--admin-text)]">
              Repeat Password
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2.5 text-[var(--admin-text)] focus:border-primary focus:outline-none"
              placeholder="Repeat your new password"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50"
          >
            {loading ? "Changing..." : "Change Password"}
          </button>
        </div>
      </form>

      {/* Site Configuration Form */}
      <form onSubmit={handleConfigSubmit} className="rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-8">
        <h2 className="text-xl font-semibold text-[var(--admin-text)] mb-6">Site Configuration</h2>
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--admin-text)]">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2.5 text-[var(--admin-text)] focus:border-primary focus:outline-none"
              placeholder="info@gradientinstitute.org"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--admin-text)]">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={formData.linkedin}
              onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2.5 text-[var(--admin-text)] focus:border-primary focus:outline-none"
              placeholder="https://www.linkedin.com/company/gradient-institute"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--admin-text)]">
              Twitter URL
            </label>
            <input
              type="url"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2.5 text-[var(--admin-text)] focus:border-primary focus:outline-none"
              placeholder="https://twitter.com/gradientinst"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        onConfirm={() => setSuccessModalOpen(false)}
        title="Saved"
        message="Changes have been successfully saved."
        confirmText="OK"
        cancelText="Close"
        confirmColor="primary"
      />
    </>
  );
}
