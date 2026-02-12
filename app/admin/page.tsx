import { requireEditor } from "../../lib/auth-helpers";
import Link from "next/link";

export default async function AdminPage() {
  const user = await requireEditor();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-[var(--admin-text)]">Admin Dashboard</h1>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/news"
          className="group rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-[var(--admin-surface-hover)] hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--admin-text)]">News</h2>
          </div>
          <p className="text-sm text-[var(--admin-text-muted)]">Manage news articles and publications</p>
        </Link>

        <Link
          href="/admin/home"
          className="group rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-[var(--admin-surface-hover)] hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--admin-text)]">Home</h2>
          </div>
          <p className="text-sm text-[var(--admin-text-muted)]">Manage Home page content</p>
        </Link>

        <Link
          href="/admin/about-us"
          className="group rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-[var(--admin-surface-hover)] hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--admin-text)]">About Us</h2>
          </div>
          <p className="text-sm text-[var(--admin-text-muted)]">Manage About Us page content</p>
        </Link>

        <Link
          href="/admin/team"
          className="group rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-[var(--admin-surface-hover)] hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--admin-text)]">Team</h2>
          </div>
          <p className="text-sm text-[var(--admin-text-muted)]">Manage team members</p>
        </Link>

        <Link
          href="/admin/partners"
          className="group rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-[var(--admin-surface-hover)] hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--admin-text)]">Partners</h2>
          </div>
          <p className="text-sm text-[var(--admin-text-muted)]">Manage partners and collaborations</p>
        </Link>

        <Link
          href="/admin/worked"
          className="group rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-[var(--admin-surface-hover)] hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--admin-text)]">Worked</h2>
          </div>
          <p className="text-sm text-[var(--admin-text-muted)]">Manage worked with organizations</p>
        </Link>

        <Link
          href="/admin/advisory"
          className="group rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-[var(--admin-surface-hover)] hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--admin-text)]">Advisory & Guidance</h2>
          </div>
          <p className="text-sm text-[var(--admin-text-muted)]">Edit Advisory page content (intro and image section)</p>
        </Link>

        <Link
          href="/admin/research-publications"
          className="group rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-[var(--admin-surface-hover)] hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--admin-text)]">Research & Publications</h2>
          </div>
          <p className="text-sm text-[var(--admin-text-muted)]">Edit Research & Publications page content (intro and image section)</p>
        </Link>

        <Link
          href="/admin/resources"
          className="group rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface)] p-6 transition hover:-translate-y-1 hover:border-primary hover:bg-[var(--admin-surface-hover)] hover:shadow-md"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-3">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-[var(--admin-text)]">Resources</h2>
          </div>
          <p className="text-sm text-[var(--admin-text-muted)]">Education page content and downloadable resources</p>
        </Link>
      </div>
    </div>
  );
}

