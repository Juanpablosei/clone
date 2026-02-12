"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    {
      label: "Research & Publications",
      href: "/research-publications",
    },
    {
      label: "Advisory & Guidance",
      href: "/advisory",
    },
    {
      label: "Education & Resources",
      href: "/education-resources",
    },
    {
      label: "About Us",
      href: "/about-us",
    },
    {
      label: "Contact Us",
      href: "/contact-us",
    },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 py-4 sm:px-10 lg:px-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/gradient-large.svg"
            alt="Gradient Institute"
            width={140}
            height={40}
            className="h-8 w-auto"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-1 lg:flex">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="hidden rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground transition hover:bg-surface lg:inline-flex"
          >
            Sign out
          </button>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-foreground transition hover:bg-surface lg:hidden"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg
                className="h-6 w-6"
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
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <div className="mx-auto max-w-[1600px] px-6 py-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block rounded-lg px-4 py-3 text-base font-medium text-foreground transition hover:bg-surface"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-2 block w-full rounded-lg border border-border px-4 py-3 text-left text-base font-medium text-foreground transition hover:bg-surface"
            >
              Sign out
            </button>
          </div>
        </div>
      )}

    </nav>
  );
}

