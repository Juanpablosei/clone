"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import TeamTabs from "./TeamTabs";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: string;
  image: string;
  slug: string;
}

interface AboutUsTeamSectionClientProps {
  membersByType: Record<string, TeamMember[]>;
}

const TYPE_LABELS: Record<string, string> = {
  OUR_TEAM: "Our Team",
  FELLOWS: "Fellows",
  BOARD: "Board",
  ADVISORY_BOARD: "Advisory Board",
  RESEARCH_STUDENT_AFFILIATES: "Research Student Affiliates",
};

const TYPE_ORDER = [
  "OUR_TEAM",
  "FELLOWS",
  "BOARD",
  "ADVISORY_BOARD",
  "RESEARCH_STUDENT_AFFILIATES",
];

export default function AboutUsTeamSectionClient({
  membersByType,
}: AboutUsTeamSectionClientProps) {
  const [activeType, setActiveType] = useState<string>("OUR_TEAM");

  // Filtrar tipos que tienen miembros
  const availableTypes = TYPE_ORDER.filter(
    (type) => membersByType[type] && membersByType[type].length > 0
  );

  const activeMembers = membersByType[activeType] || [];

  return (
    <section id="team" className="scroll-mt-24">
      <div className="flex flex-col gap-8">
        {/* Pestañas */}
        <TeamTabs
          types={availableTypes}
          labels={TYPE_LABELS}
          onTypeChange={setActiveType}
          activeType={activeType}
        />

        {/* Contenido del tipo activo */}
        <div key={activeType} className="flex flex-col gap-6">
          {activeType === "OUR_TEAM" && (
            <p className="max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
              Gradient Institute&apos;s team combines strong machine learning expertise
              with unique experience building ethically aware systems.
            </p>
          )}

          <div className="grid grid-cols-3 gap-5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8">
            {activeMembers.map((member) => (
              <Link
                key={member.id}
                href={`/about-us/people/${member.slug}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-background hover:shadow-lg"
              >
                {/* Imagen con overlay sutil */}
                <div className="relative aspect-[0.85] w-full overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                
                {/* Contenido con mejor espaciado */}
                <div className="flex flex-col gap-1.5 p-4">
                  <h3 className="text-sm font-semibold text-foreground leading-tight">
                    {member.name}
                  </h3>
                  <p className="text-xs leading-relaxed text-muted line-clamp-2">
                    {member.role}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

