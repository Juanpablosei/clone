import Hero from "../../../components/Hero";
import Footer from "../../../components/Footer";
import CTASection from "../../../components/home/CTASection";
import TeamCard from "../../../components/team/TeamCard";
import Reveal from "../../../components/Reveal";
import { prisma } from "../../../lib/prisma";

async function getTeamMembers() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { createdAt: "asc" },
    });
    return members;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

export default async function PeoplePage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Reveal>
        <Hero title="Our Team" />
      </Reveal>
      <main className="flex flex-col gap-12 px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <Reveal delay={100}>
          <div className="mx-auto w-full max-w-4xl">
            <p className="text-xl text-foreground">
              <strong>Gradient Institute's</strong> team members have deep
              expertise in machine learning research and engineering, as well as
              commercial technology consulting and technology deployment. We also
              have something unique: experience creating and developing ethically
              aware machine learning systems. We are motivated to bring about a
              world in which ethics are an integral part of data science and
              machine learning systems, and to ensure this new technology works
              to make the world fairer and more sustainable.
            </p>
          </div>
        </Reveal>

        {teamMembers.length > 0 ? (
          <Reveal delay={200}>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <TeamCard
                  key={member.id}
                  name={member.name}
                  role={member.role}
                  image={member.image}
                  slug={member.slug}
                />
              ))}
            </div>
          </Reveal>
        ) : (
          <Reveal delay={200}>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg text-muted">No team members found.</p>
            </div>
          </Reveal>
        )}
      </main>
      <Reveal>
        <CTASection />
      </Reveal>
      <Reveal>
        <Footer />
      </Reveal>
    </div>
  );
}

