import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Terms of Service",
  description:
    "Review the terms for using localCV and its resume-building features.",
  path: "/terms-of-service",
  keywords: ["terms of service", "user agreement", "localCV terms"],
  type: "article",
});

const lastUpdated = "July 8, 2026";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-4xl px-6 py-14 sm:py-16">
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-4 text-muted-foreground">
          These Terms of Service govern your use of localCV. By using the app,
          you agree to these terms. Please also review our{" "}
          <a className="underline underline-offset-4" href="/privacy-policy">
            Privacy Policy
          </a>
          , which explains how your data is handled.
        </p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-semibold">1. Use of Service</h2>
            <p className="mt-2 text-muted-foreground">
              You may use localCV for lawful personal or professional
              resume-building purposes. You agree not to misuse the app, attempt
              unauthorized access, or interfere with its operation.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              2. Account Responsibilities
            </h2>
            <p className="mt-2 text-muted-foreground">
              localCV supports optional sign-in with GitHub. If you sign in,
              you are responsible for maintaining the confidentiality of your
              GitHub credentials and for activities that occur under your
              account. If you enable GitHub Backup &amp; Sync, you are
              responsible for the private GitHub repository created in your
              account and for managing access to it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. User Content &amp; Local Data</h2>
            <p className="mt-2 text-muted-foreground">
              You retain ownership of content you create in localCV, including
              resume, profile, and job-tracker data. This data is stored
              locally in your browser by default, and you are responsible for
              backing it up (including via the optional GitHub Backup &amp;
              Sync feature) and for its accuracy. You are responsible for
              ensuring your content does not violate any third-party rights or
              applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              4. AI Features &amp; Third-Party Providers
            </h2>
            <p className="mt-2 text-muted-foreground">
              localCV&apos;s AI features (resume tailoring, ATS scoring, cover
              letter generation, section refinement, and CV parsing) require
              you to supply your own API key for a third-party AI provider
              (such as OpenAI, Anthropic, or Google). You are responsible for
              obtaining, safeguarding, and paying for your own API key and any
              usage costs charged by that provider, and for complying with
              that provider&apos;s terms of service. AI-generated outputs are
              provided for convenience, may contain errors or inaccuracies,
              and require your review and edits. You are solely responsible
              for the final resume content and how it is used, including its
              accuracy and suitability for any job application or ATS system.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
            <p className="mt-2 text-muted-foreground">
              The app, branding, and software components of localCV are
              protected by applicable intellectual property laws. These terms do
              not transfer ownership rights to you.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Disclaimer</h2>
            <p className="mt-2 text-muted-foreground">
              localCV is provided on an &quot;as is&quot; and &quot;as
              available&quot; basis without warranties of any kind, to the
              maximum extent permitted by law. We do not guarantee that
              AI-generated content will be accurate, error-free, or result in
              any particular job application outcome, and we do not guarantee
              uninterrupted availability of third-party services (such as
              GitHub or your chosen AI provider) that localCV depends on.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              7. Limitation of Liability
            </h2>
            <p className="mt-2 text-muted-foreground">
              To the maximum extent permitted by law, localCV and its operator
              are not liable for indirect, incidental, special, consequential,
              or punitive damages arising from use of the service, including
              loss of locally stored data, AI provider costs, or reliance on
              AI-generated content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
            <p className="mt-2 text-muted-foreground">
              We may update these terms periodically. Continued use of localCV
              after updates means you accept the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Contact</h2>
            <p className="mt-2 text-muted-foreground">
              For questions about these terms, contact:{" "}
              <a
                className="underline underline-offset-4"
                href="mailto:tusharvashisth4@gmail.com"
              >
                tusharvashisth4@gmail.com
              </a>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
