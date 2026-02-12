import AtomicBackground from "./home/AtomicBackground";

interface HeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  alt?: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  return (
    <section
      className="relative w-full overflow-hidden border-b border-primary/20 h-[250px] sm:h-[400px] lg:h-[500px]"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        background: "linear-gradient(to right, rgba(91, 125, 214, 0.8), rgba(91, 125, 214, 0.3))",
      }}
    >
      {/* Efecto de átomos/partículas animado */}
      <AtomicBackground />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1600px] items-center justify-center">
        <div className="px-6 text-center sm:px-10 lg:px-16">
          <h1 className="text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted sm:text-lg lg:text-xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

