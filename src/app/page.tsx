import { EasyFlowSection } from "@/components/features/landing/easy-flow-section";
import { HeroSection } from "@/components/features/landing/hero-section";
import { LandingFooter } from "@/components/features/landing/landing-footer";
import { OrbitingCirclesSection } from "@/components/features/landing/orbiting-circles-section";
import { TemplatesSection } from "@/components/features/landing/templates-section";
import { TestimonialsSection } from "@/components/features/landing/testimonials-section";
import { TopFeaturesSection } from "@/components/features/landing/top-features-section";
import { ModeToggle } from "@/components/shared/mode-toggle";

export default function Page() {
  return (
    <main className="min-h-screen bg-background text-foreground transition-colors">
      <div className="fixed right-6 top-6 z-50">
        <ModeToggle />
      </div>
      <HeroSection />
      <OrbitingCirclesSection />
      <TopFeaturesSection />
      <TemplatesSection />
      <EasyFlowSection />
      <TestimonialsSection />
      <LandingFooter />
    </main>
  );
}
