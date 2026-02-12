interface CTASectionProps {
  text?: string;
  buttonText?: string;
}

export default function CTASection({ 
  text = "Let's navigate AI responsibly together.", 
  buttonText = "Contact us" 
}: CTASectionProps = {}) {
  return (
    <section
      className="py-12 text-foreground md:py-20 lg:py-24"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        background: "linear-gradient(to right, rgba(91, 125, 214, 0.8), rgba(91, 125, 214, 0.3))",
      }}
    >
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-16">
        <div className="flex min-h-[300px] items-end gap-6 rounded-3xl px-8 pb-8 lg:min-h-[350px] lg:px-12 lg:pb-10">
          <h2 className="w-[40%] text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-5xl">
            {text}
          </h2>
          <div className="flex-1" />
          <a
            href="/contact-us"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-md transition hover:opacity-90"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </section>
  );
}

