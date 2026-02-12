import Image from "next/image";
import Link from "next/link";

interface TeamCardProps {
  name: string;
  role: string;
  image: string;
  slug: string;
}

export default function TeamCard({ name, role, image, slug }: TeamCardProps) {
  return (
    <Link href={`/about-us/people/${slug}`}>
      <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-md">
        <div className="relative aspect-[0.75] w-full overflow-hidden bg-[#0f172a]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-col gap-2 p-5">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted">{role}</p>
        </div>
      </div>
    </Link>
  );
}

