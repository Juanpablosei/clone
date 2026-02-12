import Image from "next/image";

interface PartnersImageSectionProps {
  image?: string;
  alt?: string;
}

export default function PartnersImageSection({ 
  image = "/Workday.png", 
  alt = "Partners" 
}: PartnersImageSectionProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}

