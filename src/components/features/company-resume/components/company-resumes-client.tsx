"use client";

/* ****** Main client component for /dashboard/company-resumes page ****** */

import Link from "next/link";
import { ArrowLeft, AlertCircle, KeyRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CompanyResumeList } from "./company-resume-list";
import { useProfile } from "@/components/features/profile/hooks/use-profile";
import { useAIConfig } from "@/components/features/dashboard/hooks/use-ai-config";

export function CompanyResumesClient() {
  const { isProfileCompleted, isLoading: profileLoading } = useProfile();
  const { hasApiKey, isLoading: configLoading } = useAIConfig();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-6 py-8 space-y-8">
        {/* ****** Header ****** */}
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Company Resumes
            </h1>
            <p className="text-sm text-muted-foreground">
              AI-tailored resumes for specific companies and roles.
            </p>
          </div>
        </div>

        {/* ****** Prerequisite warnings ****** */}
        {!profileLoading && !isProfileCompleted && (
          <Alert>
            <AlertCircle className="size-4" />
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>
                You need to complete your profile before creating company
                resumes.
              </span>
              <Link href="/dashboard/profile">
                <Button size="sm" variant="outline">
                  Complete Profile
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {!configLoading && !hasApiKey && isProfileCompleted && (
          <Alert>
            <KeyRound className="size-4" />
            <AlertDescription className="flex items-center justify-between gap-4">
              <span>
                Add an AI API key from the dashboard to enable resume tailoring.
              </span>
              <Link href="/dashboard">
                <Button size="sm" variant="outline">
                  Go to Dashboard
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* ****** List ****** */}
        <section>
          <CompanyResumeList />
        </section>
      </main>
    </div>
  );
}
