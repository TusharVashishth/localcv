import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description:
    "Read how localCV collects, uses, and protects your data in our local-first resume builder.",
  path: "/privacy-policy",
  keywords: ["privacy policy", "data protection", "local-first privacy"],
  type: "article",
});

const lastUpdated = "July 8, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto w-full max-w-4xl px-6 py-14 sm:py-16">
        <p className="text-sm text-muted-foreground">
          Last updated: {lastUpdated}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-4 text-muted-foreground">
          localCV is a local-first, privacy-focused resume builder. Your
          resume and profile data is stored on your own device by default, not
          on our servers. This policy explains exactly what data we process,
          why, where it goes, and what choices you have.
        </p>

        <div className="mt-10 space-y-8 leading-7">
          <section>
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="mt-2 text-muted-foreground">
              We collect different data depending on how you use localCV:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <span className="font-medium text-foreground">
                  Local resume and profile data:
                </span>{" "}
                Your profile details, resume content, company-specific
                resumes, ATS scoring results, and job application tracker
                entries are stored in your browser&apos;s local database
                (IndexedDB) on your device. We do not store this data on our
                servers unless you explicitly enable GitHub Backup &amp; Sync
                (see Section 3).
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Account information (GitHub sign-in):
                </span>{" "}
                If you sign in with GitHub, we receive your GitHub username,
                public profile information, and email address for
                authentication purposes only.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  AI provider API keys:
                </span>{" "}
                If you configure an AI provider (e.g. OpenAI, Anthropic,
                Google) to use AI features, your API key is encrypted and
                stored locally in your browser. We do not retain a copy of
                your API key on our servers.
              </li>
              <li>
                <span className="font-medium text-foreground">
                  Usage analytics:
                </span>{" "}
                We use Microsoft Clarity to understand how the app is used
                (e.g. clicks, page views, scrolling behavior) so we can
                improve the product. See Section 6 (Cookies &amp; Analytics).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. How We Use Information</h2>
            <p className="mt-2 text-muted-foreground">
              We use your information to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Generate, edit, and export resumes and related documents.</li>
              <li>
                Provide AI-assisted refinement, tailoring, cover letter
                generation, ATS scoring, and resume parsing features.
              </li>
              <li>
                Authenticate you and, if you opt in, back up your local data
                to a private repository in your own GitHub account.
              </li>
              <li>Improve app reliability, security, and user experience.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              3. OAuth, Account Access &amp; GitHub Backup
            </h2>
            <p className="mt-2 text-muted-foreground">
              localCV supports sign-in with GitHub. When you sign in, we
              request the following OAuth scopes: your basic profile and
              email (<code className="rounded bg-muted px-1 py-0.5 text-sm">read:user</code>,{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">user:email</code>) and repository
              access (<code className="rounded bg-muted px-1 py-0.5 text-sm">repo</code>). The{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-sm">repo</code> scope is used only for
              the optional GitHub Backup &amp; Sync feature, which, if you
              turn it on, creates a private repository (
              <code className="rounded bg-muted px-1 py-0.5 text-sm">localcv-backup</code>) in your own
              GitHub account and uploads an export of your local data (profile,
              resumes, ATS results, job applications) to it. This data is
              stored in a repository you own and control, not on localCV
              infrastructure. Your GitHub access token is held only in your
              session (JSON Web Token) and is not written to a persistent
              server-side database.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">
              4. AI Features &amp; Third-Party AI Providers
            </h2>
            <p className="mt-2 text-muted-foreground">
              localCV&apos;s AI features (resume tailoring, ATS scoring, cover
              letter generation, section refinement, and CV parsing) use a
              &quot;bring your own key&quot; model: you choose an AI provider
              (such as OpenAI, Anthropic, or Google) and supply your own API
              key. When you use an AI feature, the relevant resume content,
              job description, or uploaded CV text is sent through our server
              to your chosen AI provider to generate a response. We do not
              store this content in a database — it is used only in memory to
              process your request and is discarded once the response is
              returned. Use of AI features is subject to the privacy policy
              and terms of your chosen AI provider, and standard usage limits
              or costs that provider may charge to your API key.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. Data Sharing</h2>
            <p className="mt-2 text-muted-foreground">
              We do not sell your personal information. We share data only in
              the following circumstances:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                With the AI provider you configure, solely to process the AI
                requests you initiate (Section 4).
              </li>
              <li>
                With GitHub, solely to authenticate you and, if enabled, to
                back up your data to a repository you own (Section 3).
              </li>
              <li>
                With Microsoft Clarity, our analytics provider, for aggregate
                usage analytics (Section 6).
              </li>
              <li>
                With infrastructure and hosting providers necessary to operate
                the app, under appropriate contractual safeguards.
              </li>
              <li>Where required to comply with applicable law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Cookies &amp; Analytics</h2>
            <p className="mt-2 text-muted-foreground">
              We use essential cookies to maintain your sign-in session. We
              also use Microsoft Clarity, a third-party analytics service,
              which may set cookies and use local storage to record aggregate
              usage patterns (such as clicks, scrolling, and navigation) to
              help us improve localCV. Microsoft Clarity processes this data
              subject to its own privacy policy. You can control cookies
              through your browser settings, though disabling essential
              cookies may affect sign-in functionality.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. Data Retention</h2>
            <p className="mt-2 text-muted-foreground">
              Local resume, profile, and job-tracker data remains in your
              browser&apos;s IndexedDB until you delete it or clear your
              browser storage. If you enable GitHub Backup &amp; Sync, backup
              data persists in your own GitHub repository until you delete it
              there. Session data (e.g. your GitHub sign-in token) is retained
              only for the duration of your active session. We do not
              maintain a server-side database of user accounts or resume
              content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. Security</h2>
            <p className="mt-2 text-muted-foreground">
              AI provider API keys are encrypted before being stored in your
              browser, and are only decrypted transiently on our server to
              process an AI request. We apply reasonable administrative and
              technical safeguards to protect data in transit and while
              processed on our server. No method of transmission or storage is
              completely secure, so we cannot guarantee absolute security.
              Since most of your data lives on your own device, you are also
              responsible for the security of your browser and device.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">9. Your Choices</h2>
            <p className="mt-2 text-muted-foreground">
              You can control your data by editing or deleting locally stored
              content at any time, disconnecting GitHub sign-in or Backup
              &amp; Sync, removing your AI provider API key, deleting the
              backup repository in your GitHub account, clearing your
              browser&apos;s local storage, or discontinuing use of the app.
              You may also contact us for privacy-related requests.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">10. Children&apos;s Privacy</h2>
            <p className="mt-2 text-muted-foreground">
              localCV is not directed to children under 13 (or the minimum
              age required by your jurisdiction), and we do not knowingly
              collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">11. Contact</h2>
            <p className="mt-2 text-muted-foreground">
              For privacy questions or data requests, contact:{" "}
              <a
                className="underline underline-offset-4"
                href="mailto:tusharvashisth4@gmail.com"
              >
                tusharvashisth4@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">12. Updates to This Policy</h2>
            <p className="mt-2 text-muted-foreground">
              We may update this policy from time to time to reflect changes
              in the app or applicable law. Material changes will be reflected
              by updating the date at the top of this page.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
