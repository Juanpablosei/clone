import Hero from "../../components/Hero";
import Footer from "../../components/Footer";
import CTASection from "../../components/home/CTASection";
import Reveal from "../../components/Reveal";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Reveal>
        <Hero title="Privacy Policy" />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-foreground">
                Your privacy is important
              </h2>
            </div>
            <p className="text-lg leading-relaxed text-muted">
              This statement outlines the policy of Gradient Institute ("the Institute") on how the Institute uses and manages personal information provided to or collected by it.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                About the Gradient Institute
              </h3>
            </div>
            <p className="leading-relaxed text-muted">
              The Institute is an independent, not-for-profit research institute whose purpose is to progress the research, design, development and adoption of ethical artificial intelligence systems. The Institute is bound by the Australian Privacy Principles contained in the Commonwealth Privacy Act.
            </p>
          </section>
        </Reveal>

        <Reveal delay={300}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                How to contact the Institute
              </h3>
            </div>
            <p className="mb-6 leading-relaxed text-muted">
              If you have any concerns or complaints about the way your information is handled and safeguarded, or you believe there has been a breach of privacy, please contact the Institute.
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

        <Reveal delay={400}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                How is personal information collected?
              </h3>
            </div>
            <p className="mb-4 leading-relaxed text-muted">
              The Institute collects personal information from you by way of:
            </p>
            <div className="mb-6 grid gap-3 sm:grid-cols-2">
              {["web forms", "emails", "phone calls", "video conferences", "meetings"].map((method) => (
                <div key={method} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3">
                  <div className="flex h-2 w-2 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted">{method}</span>
                </div>
              ))}
            </div>
            <p className="leading-relaxed text-muted">
              In some circumstances, the Institute may be provided with personal information about an individual from a third party. When this happens, we will take steps to notify you of this, and of our privacy policy.
            </p>
          </section>
        </Reveal>

        <Reveal delay={500}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                What personal information is collected and held?
              </h3>
            </div>
            <p className="mb-6 leading-relaxed text-muted">
              We collect the following types of personal information:
            </p>
            <div className="mb-6 grid gap-2 sm:grid-cols-2">
              {[
                "Names",
                "Residential addresses",
                "Email address, telephone number, and other contact details",
                "Dates of birth",
                "Bank account details",
                "Employment details such as company, position, and professional interests",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
            <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
              <p className="text-sm leading-relaxed text-muted">
                <strong className="text-foreground">Note:</strong> We don't usually collect or hold sensitive information (this includes information such as information about your health, political opinions, or sexual orientation). If we do, we take additional measures to protect this information and ensure it is disposed of once we no longer need to keep it.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal delay={600}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                For what purposes does the Institute collect information?
              </h3>
            </div>
            <div className="space-y-4">
              {[
                {
                  title: "Website analytics",
                  description: "Using analytics tools (such as Google Analytics) to understand usage of the Gradient Institute website.",
                },
                {
                  title: "Mailing lists",
                  description: "Collecting and storing contact details and other basic details about individuals (such as company, position and interests) for use for providing information to the individuals such as news about Gradient Institute work, promoting courses and events, etc.",
                },
                {
                  title: "Training course and event registration",
                  description: "Collecting and storing contact details and other basic details about individuals (such as company, position, experience, special requirements) for use in organising training courses and events. Additionally, feedback from participants is collected and stored in training courses and events.",
                },
                {
                  title: "Data science research projects",
                  description: "Receiving and storing data sets provided by customers and partners that are used in data science research projects.",
                },
                {
                  title: "Recruitment",
                  description: "Receiving, storing and using information provided by a candidate or agent in relation to employment, internship, fellowships or volunteering",
                },
              ].map((purpose) => (
                <div key={purpose.title} className="rounded-lg border border-border bg-background p-4">
                  <h4 className="mb-2 font-semibold text-foreground">{purpose.title}</h4>
                  <p className="text-sm leading-relaxed text-muted">{purpose.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 rounded-lg border-l-4 border-primary bg-primary/5 p-4">
              <p className="text-sm leading-relaxed text-muted">
                You do have the right to seek to deal with us anonymously or using a pseudonym, but in almost every circumstance, it will not be practicable for us to deal with you or provide any services to you except for the most general responses to general inquiries, unless you identify yourself.
              </p>
              <p className="text-sm leading-relaxed text-muted">
                If you subscribe to one of our mailing lists, you may do so using a pseudonym.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal delay={700}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              How will the Institute use the personal information you provide?
            </h3>
            <p className="leading-relaxed text-muted">
              The Institution will use the personal information it collects from you for the purposes listed above, and for secondary purposes that are related to the purposes and that would be reasonably expected, or any other purposes you have consented to.
            </p>
          </section>
        </Reveal>

        <Reveal delay={800}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              Direct Marketing
            </h3>
            <div className="space-y-4">
              <p className="leading-relaxed text-muted">
                When you give us your personal information, we will ask you for your consent to use it for direct marketing (for example, to promote courses and events). You do not have to consent to this. If we received your personal information from someone else, we will only use it for direct marketing with your consent or if it is impracticable to obtain your consent.
              </p>
              <p className="leading-relaxed text-muted">
                Where we send you direct marketing by email, we comply with the Spam Act.
              </p>
              <div className="rounded-lg bg-background p-4">
                <p className="font-semibold text-foreground">
                  You may opt out of direct marketing at any time.
                </p>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={900}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Updating or correcting Personal Information
              </h3>
            </div>
            <div className="space-y-4">
              <p className="leading-relaxed text-muted">
                The Institute endeavours to ensure that the personal information it holds is accurate and up-to-date. You may seek to update the personal information held by the Institute by contacting the Institute at any time.
              </p>
              <p className="leading-relaxed text-muted">
                The Australian Privacy Principles require the Institute not to store personal information longer than necessary.
              </p>
              <div className="rounded-lg border-l-4 border-primary bg-primary/5 p-4">
                <p className="mb-2 font-semibold text-foreground">Your rights:</p>
                <ul className="ml-4 list-disc space-y-1 text-sm text-muted">
                  <li>You have the right to access any personal information the Institute holds about you</li>
                  <li>You can ask us to correct information if you think it's incorrect</li>
                  <li>You can ask us to delete your personal information</li>
                </ul>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                Please note that there are some legal limits to these rights. For example in some cases we are legally required to retain some personal information. If we are not able to fulfil your request, we will let you know why.
              </p>
              <p className="leading-relaxed text-muted">
                To make a request to access any information the Institute holds about you, please contact the institute by email. The Institute will try to respond to requests within 30 days.
              </p>
              <p className="leading-relaxed text-muted">
                The Institute may require you to verify your identity and specify what information you require.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal delay={1000}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                How does the Institute handle complaints about privacy?
              </h3>
            </div>
            <p className="mb-6 leading-relaxed text-muted">
              If you have a complaint about privacy, please contact us. We will respond to your complaint as soon as we can, and in any case within 30 days. If we receive a complaint, we will acknowledge receipt of the complaint, seek further information from the complainant if necessary, investigate the complaint, respond to the complainant with the outcome of the investigation and provide feedback to the relevant internal stakeholders.
            </p>
            <div className="rounded-lg border border-border bg-background p-6">
              <p className="mb-4 font-semibold text-foreground">
                If you are not satisfied with our response, you can complain to the Office of the Australian Information Commissioner:
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a
                    href="mailto:enquiries@oaic.gov.au"
                    className="text-primary-strong transition hover:text-primary hover:underline"
                  >
                    enquiries@oaic.gov.au
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-muted">1300 363 992</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="h-4 w-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-muted">+61 2 9284 9666</span>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={1100}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              Personal information of applicants, staff members, contractors, interns and fellows
            </h3>
            <p className="mb-4 leading-relaxed text-muted">
              In these circumstances, the Institute's purpose for collection of the information is to assess and (if successful) to engage the individual, as the case may be.
            </p>
            <p className="mb-4 leading-relaxed text-muted">
              The purposes for which the Institute uses personal information of job applicants, staff members and contractors are:
            </p>
            <div className="mb-4 grid gap-2 sm:grid-cols-2">
              {[
                "for contacting individuals",
                "for making recruiting decisions",
                "for insurance purposes",
                "to satisfy the Institute's legal obligations",
              ].map((purpose) => (
                <div key={purpose} className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-2">
                  <div className="flex h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span className="text-sm text-muted">{purpose}</span>
                </div>
              ))}
            </div>
            <p className="leading-relaxed text-muted">
              Where the Institute receives unsolicited job applications these will usually be dealt with in accordance with the unsolicited personal information requirements of the Privacy Act.
            </p>
          </section>
        </Reveal>

        <Reveal delay={1200}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <svg className="h-5 w-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                Management and security of personal information
              </h3>
            </div>
            <div className="space-y-4">
              <p className="leading-relaxed text-muted">
                The Institute's staff are required to respect the confidentiality of personal information and the privacy of individuals.
              </p>
              <p className="leading-relaxed text-muted">
                The Institute has in place an Information Security Policy which requires the protection of confidential information, including personal information, which the Institute holds.
              </p>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="mb-3 font-semibold text-foreground">The Information Security Policy specifies that:</p>
                <ul className="space-y-2">
                  {[
                    "The information only be accessible to persons who have a genuine need to access the information",
                    "Access to the information requires login using a unique ID and password",
                    "Confidentiality obligations are reinforced to those who have access",
                    "The information must not be stored on portable storage devices (including CDs, DVDs, tapes, disk drives, USB and other removable media) without encryption",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-muted">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="leading-relaxed text-muted">
                When you use our website, having cookies enabled allows us to maintain the continuity of your browsing session and remember your details when you return.
              </p>
              <p className="leading-relaxed text-muted">
                We may also use web beacons and JavaScript.
              </p>
              <p className="leading-relaxed text-muted">
                If you adjust your browser settings to block, reject or delete these functions, the webpage may not function in an optimal manner. We may also collect information about your IP address.
              </p>
            </div>
          </section>
        </Reveal>

        <Reveal delay={1300}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              Who does the Institute disclose personal information to?
            </h3>
            <p className="mb-4 leading-relaxed text-muted">
              The Institute discloses personal information, including sensitive information, held about an individual to:
            </p>
            <div className="space-y-2">
              {[
                "companies providing services to the Institute (for example, event management platform providers and mailing list platform providers)",
                "anyone you authorise the Institute to disclose information to",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
          </section>
        </Reveal>

        <Reveal delay={1400}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              Sending information overseas
            </h3>
            <p className="mb-4 leading-relaxed text-muted">
              The Institute will not disclose personal information about an individual outside Australia without:
            </p>
            <div className="mb-4 space-y-2">
              {[
                "obtaining the consent from you",
                "otherwise complying with the Australian Privacy Principles or other applicable privacy laws",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-lg border border-border bg-background px-4 py-3">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-muted">{item}</span>
                </div>
              ))}
            </div>
            <p className="leading-relaxed text-muted">
              We prioritise use of Australian-based cloud IT services but also use overseas providers of cloud IT services (such as Google Cloud and Amazon Web Services).
            </p>
          </section>
        </Reveal>

        <Reveal delay={1500}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              How long will the Institute keep my information?
            </h3>
            <p className="leading-relaxed text-muted">
              Under our destruction and de-identification policies, your personal information that is no longer required to be kept will be de-identified or destroyed.
            </p>
          </section>
        </Reveal>

        <Reveal delay={1600}>
          <section className="mb-8 rounded-2xl border border-border bg-surface p-8 shadow-sm transition hover:shadow-md">
            <h3 className="mb-4 text-xl font-semibold text-foreground">
              Changes to this policy
            </h3>
            <p className="leading-relaxed text-muted">
              The Institute will regularly review and update this Privacy Policy to account for new laws, social expectations and technology, changes to the Institute's operations and practices and to ensure it remains appropriate to the changing legal environment. This Privacy Policy is located at{" "}
              <a
                href="https://gradientinstitute.org/privacy-policy"
                className="text-primary-strong transition hover:text-primary hover:underline"
              >
                https://gradientinstitute.org/privacy-policy
              </a>
              .
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              The Policy was last updated on 9 September 2020.
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
