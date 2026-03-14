export function LandingFooter() {
  return (
    <footer className="relative h-100 overflow-hidden border-t border-border/70 bg-linear-to from-zinc-100 via-zinc-200 to-zinc-300 dark:from-zinc-900 dark:via-zinc-950 dark:to-black flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(22,163,74,0.1),transparent_70%)]" />

      <div className="relative z-10 pb-20 flex flex-col items-center justify-center text-center space-y-6 px-6">
        <p className="text-lg font-medium text-zinc-800 dark:text-zinc-200 max-w-md">
          Built with ❤️ by{" "}
          <a
            href="https://tusharvashishth.com"
            target="_blank"
            rel="noreferrer"
          >
            Tushar Vashishth
          </a>
        </p>
        {/* <div className="flex gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <a href="#" className="hover:text-primary transition-colors">
            Privacy Policy
          </a>
          <span>&bull;</span>
          <a href="#" className="hover:text-primary transition-colors">
            Terms of Service
          </a>
          <span>&bull;</span>
          <a href="#" className="hover:text-primary transition-colors">
            Contact
          </a>
        </div> */}
        <p className="text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mt-2">
          &copy; {new Date().getFullYear()} localCV. All rights reserved.
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex justify-center overflow-hidden">
        <p className="text-[clamp(4rem,15vw,12rem)] font-black leading-[0.75] tracking-tighter text-transparent bg-linear-to-b from-zinc-300/50 to-zinc-400/10 bg-clip-text dark:from-zinc-800/80 dark:to-zinc-900/20 select-none">
          LOCAL CV
        </p>
      </div>
    </footer>
  );
}
