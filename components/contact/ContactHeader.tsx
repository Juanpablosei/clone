interface ContactInfo {
  label: string;
  value: string;
  icon: React.ReactNode;
}

interface ContactHeaderProps {
  location?: string;
  address?: string;
  linkedin?: string;
  email?: string;
}

export default function ContactHeader({
  location = "Sydney",
  address = "Merewether Building H04, University of Sydney, NSW 2006, AUSTRALIA",
  linkedin = "https://www.linkedin.com/company/gradient-institute",
  email = "office@gradientinstitute.org",
}: ContactHeaderProps) {
  const contactInfo: ContactInfo[] = [
    {
      label: location,
      value: address,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "LinkedIn",
      value: linkedin,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      label: "Our Email",
      value: email,
      icon: (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-background py-8 pt-16 sm:pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {contactInfo.map((info, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-strong text-white">
                {info.icon}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">{info.label}</p>
                {info.label === "LinkedIn" ? (
                  <a
                    href={info.value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition hover:text-primary-strong hover:underline"
                  >
                    {info.value.replace(/^https?:\/\/(www\.)?linkedin\.com\/company\//i, '').replace(/\/.*$/, '')}
                  </a>
                ) : (
                  <p className="text-sm text-muted">{info.value}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
