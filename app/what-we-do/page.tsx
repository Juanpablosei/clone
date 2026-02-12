import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
import CTASection from "../../components/home/CTASection";
import Reveal from "../../components/Reveal";
import WhatWeDoSection from "../../components/what-we-do/WhatWeDoSection";

export default function WhatWeDoPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Reveal>
        <Hero title="What we do" />
      </Reveal>
      <Reveal>
        <WhatWeDoSection />
      </Reveal>
      <Reveal>
        <CTASection />
      </Reveal>
      <Reveal>
        <Footer />
      </Reveal>
    </div>
  );
}

