import { prisma } from "../../lib/prisma";
import AboutUsTeamSectionClient from "./AboutUsTeamSectionClient";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  type: string;
  image: string;
  slug: string;
}

async function getTeamMembersByType(): Promise<Record<string, TeamMember[]>> {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });

    // Agrupar por tipo
    const grouped: Record<string, TeamMember[]> = {};
    members.forEach((member) => {
      if (!grouped[member.type]) {
        grouped[member.type] = [];
      }
      grouped[member.type].push(member);
    });

    return grouped;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return {};
  }
}

export default async function AboutUsTeamSection() {
  const membersByType = await getTeamMembersByType();

  return <AboutUsTeamSectionClient membersByType={membersByType} />;
}

