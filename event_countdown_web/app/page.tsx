import type { Metadata } from "next";
import { AppShell } from "@/features/shared/components/app-shell";
import { LandingScreen } from "@/features/home/screens/landing-screen";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return (
    <AppShell>
      <LandingScreen />
    </AppShell>
  );
}
