import { OrbitingCirclesContent } from "./orbiting-circles-content";

export function OrbitingCirclesSection() {
  return (
    <section className="relative overflow-hidden border-y border-border/70 bg-muted/20 py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,rgba(34,197,94,0.06),transparent_50%)] dark:bg-[radial-gradient(circle_at_left,rgba(22,163,74,0.1),transparent_50%)]" />
      <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-6 md:px-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">
            Your CV, Your Way
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Send this CV straight to{" "}
            <span className="text-primary">dream companies</span>
          </h2>
          <p className="max-w-xl text-lg text-muted-foreground">
            Build once, export everywhere. Download PDF, Markdown , Html and
            more with a single click.
          </p>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              One-click PDF export
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              ATS-optimized formatting
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Role-specific versions in seconds
            </li>
          </ul>
        </div>
        <div className="flex justify-center lg:justify-end">
          <OrbitingCirclesContent />
        </div>
      </div>
    </section>
  );
}
