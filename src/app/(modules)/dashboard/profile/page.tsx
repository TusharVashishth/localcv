import { ProfileForm } from "@/components/features/profile/components/profile-form";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Profile",
  description:
    "Add your personal details, experience, and skills once, then reuse them across all resume templates.",
  path: "/dashboard/profile",
  keywords: ["resume profile", "skills profile", "CV data"],
});

export default function ProfilePage() {
  return (
    <main className="container mx-auto px-6 py-8">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Add all your details once — or import from a CV — and reuse across
          every resume template.
        </p>
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        <ProfileForm />
      </div>
    </main>
  );
}
