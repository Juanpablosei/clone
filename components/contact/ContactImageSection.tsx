import Image from "next/image";

interface ContactImageSectionProps {
  image: string;
  imageAlt?: string;
  phoneNumber?: string;
  callToActionText?: string;
}

export default function ContactImageSection({
  image,
  imageAlt = "Contact us",
 
}: ContactImageSectionProps) {
  

  return (
    <div className="relative h-full w-full overflow-hidden rounded-r-3xl">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
