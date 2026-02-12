import Image from "next/image";

export default function ServiceSlideSection() {
  return (
    <section
      className="relative overflow-hidden py-16 text-foreground md:py-24"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        background: "linear-gradient(to bottom right, rgba(91, 125, 214, 0.05), rgba(91, 125, 214, 0.02))",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Columna izquierda - Texto */}
          <div className="flex flex-col items-start">
            <h2 className="mb-4 text-3xl font-semibold leading-tight text-foreground sm:text-4xl lg:text-5xl">
              Outstanding service trusted by millions
            </h2>
            <p className="text-lg leading-relaxed text-muted sm:text-xl">
              Ignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi. sint
            </p>
          </div>

          {/* Columna derecha - Imagen en la parte inferior */}
          <div className="relative flex h-[400px] w-full items-end overflow-hidden sm:h-[500px] lg:h-[500px] lg:self-end">
            <div className="relative h-[80%] w-full">
              <Image
                src="/Professional_Discussion.png"
                alt="Professional Discussion"
                fill
                className="object-cover object-bottom"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

