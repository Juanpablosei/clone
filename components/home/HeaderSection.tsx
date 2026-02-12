import LogoCarousel from "../LogoCarousel";
import AtomicBackground from "./AtomicBackground";

interface HeaderSectionProps {
  title: string;
  subtitle: string;
}

export default function HeaderSection({ title, subtitle }: HeaderSectionProps) {
  return (
    <section
      className="relative flex w-full items-center overflow-hidden border-b border-primary/20"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        background: "linear-gradient(to right, rgba(91, 125, 214, 0.8), rgba(91, 125, 214, 0.3))",
        height: "600px",
      }}
    >
      {/* Efecto de átomos/partículas animado */}
      <AtomicBackground />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center justify-center">
        <div className="px-6 text-center sm:px-10 lg:px-16" style={{ transform: "translateY(-60px)" }}>
          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 z-10">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="px-6 text-center sm:px-10 lg:px-16 ">
            <p className="text-sm font-medium uppercase tracking-widest text-foreground/80 sm:text-base">
              {subtitle}
            </p>
          </div>
          <LogoCarousel />
        </div>
      </div>
    </section>
  );
}

