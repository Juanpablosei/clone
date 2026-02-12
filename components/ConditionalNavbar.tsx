"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();
  
  // Don't show navbar on auth/admin pages
  if (pathname?.startsWith("/admin") || pathname === "/login") {
    return null;
  }

  return <Navbar />;
}

