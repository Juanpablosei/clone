"use client";

import { useState, useEffect, useMemo } from "react";
import WorkedForm from "../../../components/admin/WorkedForm";
import OrgCard from "../../../components/admin/OrgCard";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import SearchBar from "../../../components/news/SearchBar";

interface Worked {
  id: string;
  name: string;
  image: string;
  url: string | null;
  description: string | null;
}

export default function WorkedPage() {
  const [worked, setWorked] = useState<Worked[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWorked, setEditingWorked] = useState<Worked | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    workedId: string | null;
    workedName: string;
  }>({
    isOpen: false,
    workedId: null,
    workedName: "",
  });

  useEffect(() => {
    fetchWorked();
  }, []);

  const fetchWorked = async () => {
    try {
      const response = await fetch(`/api/admin/worked?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setWorked(data);
      }
    } catch {
      console.error("Error fetching worked");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingWorked(null);
    fetchWorked();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingWorked(null);
  };

  const handleDelete = (id: string) => {
    const workedItem = worked.find((w) => w.id === id);
    if (workedItem) {
      setDeleteModal({
        isOpen: true,
        workedId: id,
        workedName: workedItem.name,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.workedId) return;

    try {
      const response = await fetch(`/api/admin/worked?id=${deleteModal.workedId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchWorked();
        setDeleteModal({ isOpen: false, workedId: null, workedName: "" });
      } else {
        alert("Error deleting worked");
      }
    } catch {
      alert("Error deleting worked");
    }
  };

  const handleEdit = (id: string) => {
    const workedItem = worked.find((w) => w.id === id);
    if (workedItem) {
      setEditingWorked(workedItem);
      setShowForm(true);
    }
  };

  // Filtrar worked
  const filteredWorked = useMemo(() => {
    return worked.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [worked, searchQuery]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[var(--admin-text-muted)]">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-[var(--admin-text)]">Worked</h1>
        {!showForm && (
          <button
            onClick={() => {
              setEditingWorked(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Worked
          </button>
        )}
      </div>

      {showForm && (
        <WorkedForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          worked={editingWorked}
        />
      )}

      {!showForm && (
        <>
          {/* Búsqueda */}
          <div className="flex flex-col gap-4 rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 sm:flex-row sm:items-center">
            <div className="flex-1 sm:max-w-md">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search by name, description, or URL..."
              />
            </div>
          </div>

          {/* Grid de worked */}
          {filteredWorked.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredWorked.map((item) => (
                <OrgCard
                  key={`${item.id}-${item.image}`}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-12 text-center">
              <svg
                className="mb-4 h-12 w-12 text-[var(--admin-text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium text-[var(--admin-text)]">No worked found</p>
              <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create your first worked"}
              </p>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, workedId: null, workedName: "" })}
        onConfirm={confirmDelete}
        title="Delete Worked"
        message={`Are you sure you want to delete "${deleteModal.workedName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
      />
    </div>
  );
}

