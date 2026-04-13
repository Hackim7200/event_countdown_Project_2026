import { AppShell } from "@/src/shared/components/app-shell";

export function SupportScreen() {
  return (
    <AppShell>
      <main>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">
          Support
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-zinc-600">
          Need help with The Silent Architect? Reach out through your usual
          channel or add contact details here for your users.
        </p>
      </main>
    </AppShell>
  );
}
