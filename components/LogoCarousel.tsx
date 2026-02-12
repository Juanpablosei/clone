import Image from "next/image";
import { prisma } from "../lib/prisma";

interface Worked {
  id: string;
  name: string;
  image: string;
  url: string | null;
}

async function getWorked(): Promise<Worked[]> {
  try {
    const worked = await prisma.worked.findMany({
      orderBy: { createdAt: "asc" },
    });
    return worked;
  } catch (error) {
    console.error("Error fetching worked:", error);
    return [];
  }
}

export default async function LogoCarousel() {
  const worked = await getWorked();

  if (worked.length === 0) {
    return null; // No mostrar el carrusel si no hay worked
  }

  // Duplicamos los worked 2 veces para crear un efecto de scroll infinito
  // La animación mueve el 50%, así que con 2 copias tenemos un loop perfecto
  const duplicatedWorked = [...worked, ...worked];

  return (
    <div className="relative w-full overflow-hidden py-8">
      <div className="flex animate-scroll gap-8" style={{ width: "max-content" }}>
        {duplicatedWorked.map((item, index) => {
          const content = (
            <div
              key={`${item.id}-${index}`}
              className="flex shrink-0 items-center justify-center rounded-2xl border border-border bg-white px-6 py-4 shadow-sm transition hover:shadow-md"
              style={{ width: "180px" }}
              title={item.name}
            >
              <Image
                src={item.image}
                alt={item.name}
                width={140}
                height={60}
                className="h-10 w-auto object-contain grayscale transition hover:grayscale-0"
                unoptimized
              />
            </div>
          );

          return item.url ? (
            <a
              key={`${item.id}-${index}`}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {content}
            </a>
          ) : (
            content
          );
        })}
      </div>
    </div>
  );
}

