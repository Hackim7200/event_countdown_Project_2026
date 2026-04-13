import { AppShell } from "@/src/shared/components/app-shell";

export function PrivacyScreen() {
  return (
    <AppShell>
      <main>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
          Privacy
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-600">
          This page is a placeholder for your privacy policy. Replace this text
          with how you collect, use, and protect user data.
        </p>
      </main>
    </AppShell>
  );
}
