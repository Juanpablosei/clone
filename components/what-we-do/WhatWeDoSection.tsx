interface Pillar {
  eyebrow: string;
  title: string;
  kicker: string;
  body: string;
  bullets: string[];
}

const pillars: Pillar[] = [
  {
    eyebrow: "Pillar 1",
    title: "Deep, independent research",
    kicker: "Understanding AI progress, safety, and societal impact.",
    body: "We conduct, distil, and interpret research on AI capability, safety, and sociotechnical impacts, often through sponsored projects and strategic partnerships. Our work generates new knowledge for high-stakes problems where deep technical and scientific understanding is essential—no hype, no hidden agendas, just science people can rely on.",
    bullets: [
      "Study how AI systems actually behave over time.",
      "Analyse safety, robustness, and failure modes.",
      "Investigate societal and institutional impacts of AI adoption.",
      "Publish insights that distil what matters, clearly and responsibly.",
    ],
  },
  {
    eyebrow: "Pillar 2",
    title: "Advisory & expert guidance",
    kicker: "Bringing scientific understanding into real decisions.",
    body: "We partner with governments, organisations, civil society, and communities to integrate scientific understanding of AI into concrete decisions, policies, and systems. Beyond advice, we help people see the terrain clearly, bring context into focus, and design thoughtful implementation as AI reshapes their world.",
    bullets: [
      "Translate technical research into actionable strategies and safeguards.",
      "Support policy, regulatory, and governance decisions on AI.",
      "Review and stress-test AI systems for risk and impact.",
      "Act as an independent, trusted voice in complex AI decisions.",
    ],
  },
  {
    eyebrow: "Pillar 3",
    title: "Education & capability building",
    kicker: "Building skills, judgment, and calibrated trust.",
    body: "We help people across government, industry, civil society, and the public build a grounded understanding of AI: what it is, what it can and cannot do, where it can fail, and how to engage with it responsibly. Our programs focus on skills, judgment, and calibrated trust—not blind adoption.",
    bullets: [
      "Design learning programs and workshops tailored to different audiences.",
      "Explain AI capabilities and limitations in clear, non-hyped language.",
      "Explore real-world scenarios, risks, and governance challenges.",
      "Equip teams to ask better questions and make informed choices.",
    ],
  },
  {
    eyebrow: "Pillar 4",
    title: "Public benefit & societal engagement",
    kicker: "Putting public interest at the centre of AI.",
    body: "We put public benefit at the centre of everything we do. As an independent nonprofit, we focus on work that scales and helps society make thoughtful, evidence-based decisions about AI. We make AI more understandable and empower communities and civil society to shape the systems that shape their lives.",
    bullets: [
      "Collaborate with civil society and community organisations.",
      "Make technical issues legible to non-technical audiences.",
      "Contribute to public debates, standards, and policy processes.",
      "Advocate for careful, purposeful, ethical development and use of AI.",
    ],
  },
];

export default function WhatWeDoSection() {
  return (
    <section
      id="what-we-do"
      className="bg-white py-16 text-[#2d2d2d] md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        {/* Top area */}
        <div className="mb-16 max-w-5xl">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.1em] text-[#5b7dd6]">
            What we do
          </p>
          <h2 className="mb-6 text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
            What we do
          </h2>
          <p className="mb-4 text-lg leading-relaxed text-[#2d2d2d]">
            We help society understand, govern, and use AI with judgment. We
            combine deep technical research, practical guidance, education, and
            public-benefit work to bring clarity into the fog of AI uncertainty.
          </p>
          <p className="text-base leading-relaxed text-[#2d2d2d]/80">
            Our work spans four pillars that together support calibrated,
            evidence-based decisions about AI across government, industry, civil
            society, and communities.
          </p>
        </div>

        {/* Pillars grid */}
        <div className="grid gap-8 md:grid-cols-2 xl:gap-12">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="group rounded-2xl border border-neutral-200 bg-white p-8 transition-transform transition-colors duration-200 hover:-translate-y-0.5 hover:bg-neutral-50 focus-within:border-[#5b7dd6]/30"
            >
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#5b7dd6]">
                {pillar.eyebrow}
              </p>
              <h3 className="mb-2 text-2xl font-semibold leading-tight">
                {pillar.title}
              </h3>
              <p className="mb-4 text-sm text-[#2d2d2d]/70">{pillar.kicker}</p>
              <p className="mb-6 text-sm leading-relaxed text-[#2d2d2d]/90">
                {pillar.body}
              </p>
              <ul className="flex flex-col gap-3">
                {pillar.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-3 text-sm leading-relaxed text-[#2d2d2d]/90"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#5b7dd6] transition-transform duration-200 group-hover:translate-y-0.5"
                      aria-hidden="true"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
