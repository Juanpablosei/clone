"use client";

import { useEffect, useState } from "react";
import ConfirmModal from "../../../components/admin/ConfirmModal";

interface ResourceDownload {
  id: string;
  name: string;
  email: string;
  resourceTitle: string;
  createdAt: string;
}

export default function ResourceDownloadsPage() {
  const [downloads, setDownloads] = useState<ResourceDownload[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    downloadId: string | null;
    downloadName: string;
  }>({
    isOpen: false,
    downloadId: null,
    downloadName: "",
  });

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await fetch(`/api/admin/resource-downloads?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setDownloads(data);
      }
    } catch (error) {
      console.error("Error fetching downloads");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteModal({
      isOpen: true,
      downloadId: id,
      downloadName: name,
    });
  };

  const confirmDelete = async () => {
    if (!deleteModal.downloadId) return;

    try {
      const response = await fetch(
        `/api/admin/resource-downloads?id=${deleteModal.downloadId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchDownloads();
        setDeleteModal({ isOpen: false, downloadId: null, downloadName: "" });
      } else {
        alert("Error deleting download");
      }
    } catch (error) {
      alert("Error deleting download");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadCSV = () => {
    if (downloads.length === 0) {
      alert("No data to download");
      return;
    }

    // Obtener solo emails únicos (sin duplicados)
    const uniqueEmails = Array.from(
      new Set(downloads.map((download) => download.email))
    );

    // Crear CSV con solo emails (un email por línea)
    const csvContent = uniqueEmails.join("\n");

    // Crear blob y descargar
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", `email-list-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--admin-text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--admin-text)]">
            Email
          </h1>
          <p className="mt-2 text-sm text-[var(--admin-text-muted)]">
            Manage and view all email registrations from resource downloads
          </p>
        </div>
        {downloads.length > 0 && (
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-strong"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download CSV
          </button>
        )}
      </div>

      {downloads.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-[var(--admin-text-muted)]">
            No downloads registered yet
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)]">
          <table className="w-full">
            <thead className="bg-[var(--admin-bg)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                  Resource
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--admin-text-muted)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--admin-border)]">
              {downloads.map((download) => (
                <tr key={download.id} className="hover:bg-[var(--admin-bg)]">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--admin-text)]">
                    {download.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--admin-text)]">
                    {download.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--admin-text)]">
                    {download.resourceTitle}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-[var(--admin-text-muted)]">
                    {formatDate(download.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                    <button
                      onClick={() => handleDelete(download.id, download.name)}
                      className="text-red-600 transition hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, downloadId: null, downloadName: "" })
        }
        onConfirm={confirmDelete}
        title="Delete Download Registration"
        message={`Are you sure you want to delete the registration for "${deleteModal.downloadName}"? This action cannot be undone.`}
      />
    </div>
  );
}

