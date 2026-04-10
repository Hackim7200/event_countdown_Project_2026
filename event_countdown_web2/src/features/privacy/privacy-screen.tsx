import { AppHeader } from "@/src/features/todo/components/app-header";

export function PrivacyScreen() {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#F8F9FA]">
      <AppHeader activeNav="todos" />
      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-10 md:px-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] md:text-3xl">
          Privacy
        </h1>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-[#6B7280]">
          This page is a placeholder for your privacy policy. Replace this text
          with how you collect, use, and protect user data.
        </p>
      </main>
    </div>
  );
}
