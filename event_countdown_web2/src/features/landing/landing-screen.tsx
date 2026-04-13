import { Hero } from "@/src/features/landing/components/hero";
import { AppShell } from "@/src/shared/components/app-shell";

export function LandingScreen() {
  return (
    <AppShell activeNav="home" layout="wide">
      <Hero showEyebrow={false} />
    </AppShell>
  );
}
