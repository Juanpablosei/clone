"use client";

import { useState, useEffect } from "react";
import TeamMemberForm from "../../../components/admin/TeamMemberForm";
import TeamCard from "../../../components/admin/TeamCard";
import ConfirmModal from "../../../components/admin/ConfirmModal";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: string;
  image: string;
  slug: string;
  description: string | null;
  linkedin?: string | null;
  x?: string | null;
  url?: string | null;
}

export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    memberId: string | null;
    memberName: string;
  }>({
    isOpen: false,
    memberId: null,
    memberName: "",
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      // Agregar timestamp para evitar caché
      const response = await fetch(`/api/admin/team?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch {
      console.error("Error fetching team");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingMember(null);
    fetchTeam(); // Refresh the team list
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingMember(null);
  };

  const handleDelete = (id: string) => {
    const member = team.find((m) => m.id === id);
    if (member) {
      setDeleteModal({
        isOpen: true,
        memberId: id,
        memberName: member.name,
      });
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.memberId) return;

    try {
      const response = await fetch(`/api/admin/team?id=${deleteModal.memberId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTeam(); // Refresh the team list
      } else {
        alert("Error deleting team member");
      }
    } catch {
      alert("Error deleting team member");
    } finally {
      setDeleteModal({
        isOpen: false,
        memberId: null,
        memberName: "",
      });
    }
  };

  const handleEdit = (id: string) => {
    const member = team.find((m) => m.id === id);
    if (member) {
      setEditingMember(member);
      setShowForm(true);
    }
  };

  // Filtrar miembros según búsqueda y tipo
  const filteredTeam = team.filter((member) => {
    const matchesSearch =
      searchQuery === "" ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || member.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

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
        <h1 className="text-3xl font-semibold text-[var(--admin-text)]">Team</h1>
        {!showForm && (
          <button
            onClick={() => {
              setEditingMember(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-strong"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Member
          </button>
        )}
      </div>

      {showForm && (
        <TeamMemberForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
          member={editingMember}
        />
      )}

      {!showForm && (
        <>
          {/* Buscador y Filtros */}
          <div className="flex flex-col gap-4">
            {/* Buscador */}
            <div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or role..."
                className="w-full rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2 text-sm text-[var(--admin-text)] transition focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
              />
            </div>
            
            {/* Filtro por tipo - Botones */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTypeFilter("all")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  typeFilter === "all"
                    ? "bg-primary text-white"
                    : "bg-[var(--admin-surface)] text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-[var(--admin-primary-lighter)]"
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => setTypeFilter("OUR_TEAM")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  typeFilter === "OUR_TEAM"
                    ? "bg-primary text-white"
                    : "bg-[var(--admin-surface)] text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-[var(--admin-primary-lighter)]"
                }`}
              >
                Our team
              </button>
              <button
                onClick={() => setTypeFilter("FELLOWS")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  typeFilter === "FELLOWS"
                    ? "bg-primary text-white"
                    : "bg-[var(--admin-surface)] text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-[var(--admin-primary-lighter)]"
                }`}
              >
                Fellows
              </button>
              <button
                onClick={() => setTypeFilter("BOARD")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  typeFilter === "BOARD"
                    ? "bg-primary text-white"
                    : "bg-[var(--admin-surface)] text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-[var(--admin-primary-lighter)]"
                }`}
              >
                Board
              </button>
              <button
                onClick={() => setTypeFilter("ADVISORY_BOARD")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  typeFilter === "ADVISORY_BOARD"
                    ? "bg-primary text-white"
                    : "bg-[var(--admin-surface)] text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-[var(--admin-primary-lighter)]"
                }`}
              >
                Advisory Board
              </button>
              <button
                onClick={() => setTypeFilter("RESEARCH_STUDENT_AFFILIATES")}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                  typeFilter === "RESEARCH_STUDENT_AFFILIATES"
                    ? "bg-primary text-white"
                    : "bg-[var(--admin-surface)] text-[var(--admin-text)] border border-[var(--admin-border)] hover:bg-[var(--admin-primary-lighter)]"
                }`}
              >
                Research Student Affiliates
              </button>
            </div>
          </div>

          {/* Lista de miembros filtrados */}
          {filteredTeam.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-[var(--admin-text-muted)]">
                {searchQuery || typeFilter !== "all"
                  ? "No members found matching your criteria"
                  : "No team members yet"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTeam.map((member) => (
                <TeamCard
                  key={`${member.id}-${member.image}`}
                  member={member}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
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
            memberId: null,
            memberName: "",
          })
        }
        onConfirm={confirmDelete}
        title="Delete Team Member"
        message={`Are you sure you want to delete "${deleteModal.memberName}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="danger"
      />
    </div>
  );
}

