import { DashboardClient } from "@/components/features/dashboard/components/dashboard-client";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Dashboard",
  description:
    "Manage your resume versions, continue editing, and track profile completion from your localCV dashboard.",
  path: "/dashboard",
  keywords: ["resume dashboard", "manage resumes", "resume workflow"],
});

export default function DashboardPage() {
  return <DashboardClient />;
}
