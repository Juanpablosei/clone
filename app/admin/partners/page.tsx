"use client";

import { useState, useEffect, useMemo } from "react";
import PartnerForm from "../../../components/admin/PartnerForm";
import OrgCard from "../../../components/admin/OrgCard";
import ConfirmModal from "../../../components/admin/ConfirmModal";
import SearchBar from "../../../components/news/SearchBar";

interface Partner {
  id: string;
  name: string;
  image: string;
  url: string | null;
  description: string | null;
}

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    partnerId: string | null;
    partnerName: string;
  }>({
    isOpen: false,
    partnerId: null,
    partnerName: "",
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await fetch(`/api/admin/partners?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setPartners(data);
      }
    } catch {
      console.error("Error fetching partners");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPartner(null);
    fetchPartners();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPartner(null);
  };

  const handleDelete = (id: string) => {
    const partner = partners.find((p) => p.id === id);
    if (partner) {
      setDeleteModal({
        isOpen: true,
        partnerId: id,
        partnerName: partner.name,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.partnerId) return;

    try {
      const response = await fetch(`/api/admin/partners?id=${deleteModal.partnerId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchPartners();
        setDeleteModal({ isOpen: false, partnerId: null, partnerName: "" });
      } else {
        alert("Error deleting partner");
      }
    } catch {
      alert("Error deleting partner");
    }
  };

  const handleEdit = (id: string) => {
    const partner = partners.find((p) => p.id === id);
    if (partner) {
      setEditingPartner(partner);
      setShowForm(true);
    }
  };

  // Filtrar partners
  const filteredPartners = useMemo(() => {
    return partners.filter((item) => {
      const matchesSearch =
        searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.url?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [partners, searchQuery]);

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
        <h1 className="text-3xl font-semibold text-[var(--admin-text)]">Partners</h1>
        {!showForm && (
          <button
            onClick={() => {
              setEditingPartner(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Partner
          </button>
        )}
      </div>

      {showForm && (
        <PartnerForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          partner={editingPartner}
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

          {/* Grid de partners */}
          {filteredPartners.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {filteredPartners.map((item) => (
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
              <p className="text-lg font-medium text-[var(--admin-text)]">No partners found</p>
              <p className="mt-1 text-sm text-[var(--admin-text-muted)]">
                {searchQuery
                  ? "Try adjusting your search"
                  : "Create your first partner"}
              </p>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, partnerId: null, partnerName: "" })}
        onConfirm={confirmDelete}
        title="Delete Partner"
        message={`Are you sure you want to delete "${deleteModal.partnerName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
      />
    </div>
  );
}
