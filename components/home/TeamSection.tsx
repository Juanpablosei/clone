import { prisma } from "../../lib/prisma";
import TeamCarousel from "./TeamCarousel";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  slug: string;
}

async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const members = await prisma.teamMember.findMany({
      where: {
        type: "OUR_TEAM",
      },
      orderBy: { createdAt: "asc" },
    });
    return members;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

export default async function TeamSection() {
  const teamMembers = await getTeamMembers();

  if (teamMembers.length === 0) {
    return null; // No mostrar la sección si no hay miembros
  }

  return (
    <section
      id="team"
      className="relative overflow-hidden border border-primary/10 py-8 shadow-sm sm:py-10 lg:py-12 scroll-mt-24"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        background: "linear-gradient(to right, rgba(91, 125, 214, 0.15), rgba(91, 125, 214, 0.08), rgba(91, 125, 214, 0.15))",
      }}
    >
      {/* Contenido */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold text-primary sm:text-4xl lg:text-5xl">
            Our Team
          </h2>
          <p className="max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
            Gradient Institute&apos;s team combines strong machine learning expertise
            with unique experience building ethically aware systems. We work to make
            ethics central to data science and ensure these technologies foster a
            fairer, more sustainable world.
          </p>
        </div>

        {/* Carrusel de miembros del equipo */}
        <TeamCarousel teamMembers={teamMembers} />
      </div>
    </section>
  );
}
