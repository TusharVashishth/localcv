import { ModeToggle } from "@/components/shared/mode-toggle";
import { ProfileCompletionBanner } from "@/components/features/profile/components/profile-completion-banner";
import { Button } from "@/components/ui/button";
import { FileText, UserRound } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function modulesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      {/* ****** Navbar ****** */}
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          {/* Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="bg-primary rounded-md p-1.5">
              <FileText className="size-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg tracking-tight">localCV</span>
          </Link>

          {/* Nav actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button variant="ghost" size="sm">
              <Link
                href="/dashboard/profile"
                className="flex items-center justify-center space-x-2"
              >
                <UserRound className="size-4" />
              </Link>
            </Button>
            <div className="w-px h-5 bg-border mx-1" />
            <ModeToggle />
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 pt-4">
        <ProfileCompletionBanner />
      </section>

      {children}
    </main>
  );
}
