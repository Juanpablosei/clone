"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "News",
    href: "/admin/news",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    label: "Team",
    href: "/admin/team",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    label: "Partners",
    href: "/admin/partners",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    label: "Worked",
    href: "/admin/worked",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h8m-8 4h6" />
      </svg>
    ),
  },
  {
    label: "Email",
    href: "/admin/email",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Config",
    href: "/admin/config",
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResultMessage, setSyncResultMessage] = useState("");
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [resetResultMessage, setResetResultMessage] = useState("");
  const isAdmin = session?.user?.role === "ADMIN";
  const visibleNavItems = navItems.filter(
    (item) => (item.href !== "/admin/config" && item.href !== "/admin/email") || isAdmin
  );

  const handleSyncDatabase = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncResultMessage("");
    try {
      const response = await fetch("/api/admin/sync-main", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setSyncResultMessage("Failed to publish changes.");
        return;
      }
      setSyncResultMessage("Changes published successfully.");
    } catch {
      setSyncResultMessage("Failed to publish changes.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetSystem = async () => {
    if (isResetting) return;
    setIsResetting(true);
    setResetResultMessage("");
    try {
      const response = await fetch("/api/admin/reset-system", { method: "POST" });
      const data = await response.json();
      if (!response.ok || !data?.ok) {
        setResetResultMessage("Failed to clean changes.");
        return;
      }
      setResetResultMessage("Changes cleaned successfully.");
    } catch (error) {
      setResetResultMessage("Failed to clean changes.");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <nav className="border-b border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-1">
            {visibleNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setIsSyncConfirmOpen(true)}
            disabled={isSyncing || isResetting}
            className="rounded-lg border border-[var(--admin-border)] bg-[var(--admin-surface)] px-4 py-2 text-sm font-medium text-[var(--admin-text)] transition hover:bg-[var(--admin-surface-hover)] disabled:opacity-50"
          >
            {isSyncing ? "Publishing..." : "Publish Changes"}
          </button>
          <button
            type="button"
            onClick={() => setIsResetConfirmOpen(true)}
            disabled={isSyncing || isResetting}
            className="rounded-lg border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
          >
            {isResetting ? "Cleaning..." : "Clean Changes"}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <Link
            href="/admin/home"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              pathname === "/admin/home"
                ? "bg-primary text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>
          <Link
            href="/admin/research-publications"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              pathname === "/admin/research-publications"
                ? "bg-primary text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Research
          </Link>
          <Link
            href="/admin/advisory"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              pathname === "/admin/advisory"
                ? "bg-primary text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Advisory
          </Link>
          <Link
            href="/admin/resources"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              pathname === "/admin/resources"
                ? "bg-primary text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Education
          </Link>
          <Link
            href="/admin/about-us"
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
              pathname === "/admin/about-us"
                ? "bg-primary text-white"
                : "text-[var(--admin-text-muted)] hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
            }`}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            About Us
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--admin-text-muted)] transition hover:bg-[var(--admin-primary-lighter)] hover:text-[var(--admin-text)]"
          >
            Sign out
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={isSyncConfirmOpen}
        onClose={() => {
          if (isSyncing) return;
          setIsSyncConfirmOpen(false);
          setSyncResultMessage("");
        }}
        onConfirm={() => {
          if (syncResultMessage) {
            setIsSyncConfirmOpen(false);
            setSyncResultMessage("");
            return;
          }
          handleSyncDatabase();
        }}
        title={
          isSyncing
            ? "Publishing Changes"
            : syncResultMessage
              ? "Publication Result"
              : "Confirm Publication"
        }
        message={
          isSyncing
            ? "Please wait while we publish changes to the main database."
            : syncResultMessage ? (
              <div className="whitespace-pre-wrap text-sm">{syncResultMessage}</div>
            ) : (
              "Are you sure you want to publish the changes?"
            )
        }
        confirmText={syncResultMessage ? "Close" : "Start"}
        cancelText="Cancel"
        showActions={!isSyncing}
        isLoading={isSyncing}
        disableClose={isSyncing}
      />

      <ConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => {
          if (isResetting) return;
          setIsResetConfirmOpen(false);
          setResetResultMessage("");
        }}
        onConfirm={() => {
          if (resetResultMessage) {
            setIsResetConfirmOpen(false);
            setResetResultMessage("");
            return;
          }
          handleResetSystem();
        }}
        title={
          isResetting
            ? "Cleaning Changes"
            : resetResultMessage
              ? "Clean Result"
              : "Confirm Clean Changes"
        }
        message={
          isResetting
            ? "Please wait while we clean changes and reset Base 2 to match Base 1."
            : resetResultMessage ? (
              <div className="whitespace-pre-wrap text-sm">{resetResultMessage}</div>
            ) : (
              "Are you sure you want to delete all changes?"
            )
        }
        confirmText={resetResultMessage ? "Close" : "Clean"}
        cancelText="Cancel"
        showActions={!isResetting}
        isLoading={isResetting}
        disableClose={isResetting}
        confirmColor="danger"
      />
    </nav>
  );
}

