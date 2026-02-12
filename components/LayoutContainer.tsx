"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface LayoutContainerProps {
  children: ReactNode;
}

export default function LayoutContainer({ children }: LayoutContainerProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Para admin dejamos que el fondo ocupe todo, el contenido lo limita cada layout específico.
  if (isAdmin) return <div className="w-full">{children}</div>;

  // Para el sitio público, limitamos el contenido a 1600px.
  return <div className="mx-auto max-w-[1600px]">{children}</div>;
}

