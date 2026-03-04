"use client";

import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useProfile } from "../hooks/use-profile";

export function ProfileCompletionBanner() {
  const { isLoading, isProfileCompleted } = useProfile();

  if (isLoading || isProfileCompleted) {
    return null;
  }

  return (
    <Alert className="mb-6">
      <AlertTitle>Complete your profile</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>
          Complete your full profile once to unlock template-based resume
          generation and downloads.
        </span>
        <Link href="/dashboard/profile">
          <Button size="sm" className="w-fit">
            Complete Profile
          </Button>
        </Link>
      </AlertDescription>
    </Alert>
  );
}
