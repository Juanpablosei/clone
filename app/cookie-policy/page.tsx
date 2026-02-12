import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
import CTASection from "../../components/home/CTASection";
import Reveal from "../../components/Reveal";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Reveal>
        <Hero title="Cookie Policy" />
      </Reveal>
      <main className="mx-auto w-full max-w-4xl px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <Reveal delay={100}>
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-[#e6f4ff] px-4 py-1.5 text-xs font-semibold text-primary-strong">
              Last updated: 9 September 2020
            </span>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="mb-16 rounded-2xl border border-border bg-surface p-8 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                What are cookies?
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-muted">
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                How we use cookies
              </h3>
            </div>
            <p className="mb-6 leading-relaxed text-muted">
              Gradient Institute uses cookies to enhance your experience on our website. We use cookies for the following purposes:
            </p>
            <div className="space-y-4">
              {[
                {
                  title: "Session Management",
                  description: "To maintain the continuity of your browsing session and remember your details when you return to our website. This helps us provide a seamless experience as you navigate through our pages.",
                },
                {
                  title: "Authentication",
                  description: "To keep you logged in when you access the admin area of our website. These cookies are essential for the secure operation of our administrative functions.",
                },
                {
                  title: "Website Analytics",
                  description: "To understand how visitors use our website. We may use analytics tools (such as Google Analytics) that place cookies to help us analyze website traffic and usage patterns. This information helps us improve our website and better serve our visitors.",
                },
                {
                  title: "Preferences",
                  description: "To remember your preferences and settings, such as language preferences or display settings, so that you don't have to reconfigure them each time you visit.",
                },
              ].map((use) => (
                <div key={use.title} className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold text-foreground">{use.title}</h4>
                  <p className="text-sm leading-relaxed text-muted">{use.description}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={300}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Types of cookies we use
              </h3>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-background p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Essential Cookies
                </h4>
                <p className="text-sm leading-relaxed text-muted">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies as they are essential for the website to work.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Analytics Cookies
                </h4>
                <p className="text-sm leading-relaxed text-muted">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the way our website works and measure the effectiveness of our content.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <h4 className="mb-2 flex items-center gap-2 font-semibold text-foreground">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Preference Cookies
                </h4>
                <p className="text-sm leading-relaxed text-muted">
                  These cookies allow our website to remember information that changes the way the website behaves or looks, such as your preferred language or the region you are in.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={400}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Cookie duration
              </h3>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-background p-4">
                <h4 className="mb-2 font-semibold text-foreground">Session Cookies</h4>
                <p className="text-sm leading-relaxed text-muted">
                  These cookies are temporary and are deleted when you close your browser. They are used to maintain your session while you browse our website.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <h4 className="mb-2 font-semibold text-foreground">Persistent Cookies</h4>
                <p className="text-sm leading-relaxed text-muted">
                  These cookies remain on your device for a set period or until you delete them. They help us recognize you when you return to our website and remember your preferences.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={500}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Managing cookies
              </h3>
            </div>
            <p className="mb-6 leading-relaxed text-muted">
              You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can usually modify your browser settings to decline cookies if you prefer.
            </p>
            <div className="mb-6 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
              <p className="mb-3 text-sm font-semibold text-foreground">Important Note:</p>
              <p className="text-sm leading-relaxed text-muted">
                If you choose to disable cookies, some features of our website may not function properly. Essential cookies cannot be disabled as they are necessary for the website to operate.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-foreground">How to manage cookies in your browser:</h4>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { browser: "Google Chrome", steps: "Settings > Privacy and security > Cookies and other site data" },
                  { browser: "Mozilla Firefox", steps: "Options > Privacy & Security > Cookies and Site Data" },
                  { browser: "Safari", steps: "Preferences > Privacy > Cookies and website data" },
                  { browser: "Microsoft Edge", steps: "Settings > Privacy, search, and services > Cookies and site permissions" },
                ].map((item) => (
                  <div key={item.browser} className="rounded-lg border border-border bg-background p-4">
                    <h5 className="mb-2 font-semibold text-foreground">{item.browser}</h5>
                    <p className="text-sm text-muted">{item.steps}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={600}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Third-party cookies
              </h3>
            </div>
            <p className="mb-4 leading-relaxed text-muted">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the website.
            </p>
            <div className="rounded-lg border border-border bg-background p-4">
              <h4 className="mb-3 font-semibold text-foreground">Third-party services we may use:</h4>
              <div className="space-y-2">
                {[
                  "Google Analytics - to analyze website traffic and usage patterns",
                  "Cloudinary - for image hosting and optimization",
                  "NextAuth - for secure authentication and session management",
                ].map((service) => (
                  <div key={service} className="flex items-start gap-3 text-sm text-muted">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{service}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              These third-party services have their own privacy policies and cookie practices. We encourage you to review their policies to understand how they use cookies and other tracking technologies.
            </p>
          </section>
        </Reveal>

        <Reveal delay={700}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Contact us
              </h3>
            </div>
            <p className="mb-6 leading-relaxed text-muted">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email
                </div>
                <a
                  href="mailto:info@gradientinstitute.org"
                  className="text-primary-strong transition hover:text-primary hover:underline"
                >
                  info@gradientinstitute.org
                </a>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Phone
                </div>
                <p className="text-muted">
                  02 9055 2062 (Australia)<br />
                  +61 2 9055 2062 (International)
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={800}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              Changes to this Cookie Policy
            </h3>
            <p className="leading-relaxed text-muted">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the "Last updated" date.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              We encourage you to review this Cookie Policy periodically to stay informed about our use of cookies.
            </p>
          </section>
        </Reveal>
      </main>
      <Reveal>
        <CTASection />
      </Reveal>
      <Reveal>
        <Footer />
      </Reveal>
    </div>
  );
}

