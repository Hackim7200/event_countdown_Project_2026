import { AppShell } from "@/src/shared/components/app-shell";

export function SupportScreen() {
  return (
    <AppShell activeNav="home">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
          Help
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#1A1A1A] capitalize md:text-[44px] md:leading-tight">
          Support
        </h1>
        <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[#6B7280] md:text-[15px]">
          Get help with todos, events, and Pomodoro sessions in The Silent
          Architect.
        </p>

        <article
          className="mt-10 rounded-lg bg-white px-5 py-5 shadow-[0_1px_3px_rgba(15,23,42,0.07)] md:px-6 md:py-[18px]"
          aria-labelledby="support-heading"
        >
          <h2 id="support-heading" className="sr-only">
            Support details
          </h2>
          <div className="space-y-4 text-[14px] leading-relaxed text-[#6B7280] md:text-[15px]">
            <p>
              Need help? Add your preferred contact channel here — email,
              in-app feedback, or a support portal — so users know how to reach
              you.
            </p>
            <p>
              For account or sync issues, mention that the same backend powers
              the web workspace and the Event Countdown mobile apps.
            </p>
          </div>
        </article>
      </div>
    </AppShell>
  );
}
