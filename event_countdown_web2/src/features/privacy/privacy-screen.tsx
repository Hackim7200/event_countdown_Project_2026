import { AppShell } from "@/src/shared/components/app-shell";

export function PrivacyScreen() {
  return (
    <AppShell activeNav="home">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
          Legal
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#1A1A1A] capitalize md:text-[44px] md:leading-tight">
          Privacy
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[#6B7280] md:text-[15px]">
          How we handle data for The Silent Architect. Replace this placeholder
          with your real policy before production.
        </p>

        <article
          className="mt-10 rounded-lg bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.07)] md:px-6 md:py-[18px]"
          aria-labelledby="privacy-heading"
        >
          <h2 id="privacy-heading" className="sr-only">
            Privacy policy summary
          </h2>
          <div className="space-y-4 text-[14px] leading-relaxed text-[#6B7280] md:text-[15px]">
            <p>
              This page is a placeholder for your privacy policy. Describe what
              you collect (account data, usage, analytics), why you collect it,
              how long you keep it, and how users can exercise their rights.
            </p>
            <p>
              Align this document with your mobile apps and any third-party
              services (for example authentication or hosting) that process user
              data on your behalf.
            </p>
          </div>
        </article>
      </div>
    </AppShell>
  );
}
