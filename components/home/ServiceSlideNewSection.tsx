import Image from "next/image";

interface ServiceSlideNewSectionProps {
  image?: string;
  alt?: string;
}

export default function ServiceSlideNewSection({ 
  image = "/Conference.png", 
  alt = "Conference" 
}: ServiceSlideNewSectionProps) {
  return (
    <section
      className="relative h-[600px] w-full overflow-hidden sm:h-[700px] lg:h-[800px]"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
      }}
    >
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
    </section>
  );
}

