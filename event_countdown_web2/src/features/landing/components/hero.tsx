import Link from "next/link";

type HeroProps = {
  /** When false, hide the product line (e.g. when parent `AppShell` already shows it). */
  showEyebrow?: boolean;
};

export function Hero({ showEyebrow = true }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden rounded-lg border border-[#E8EAED] bg-linear-to-b from-[#FAFAF9] to-white shadow-sm"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#E8D5C4]/35 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-[#E8EAED]/60 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-[1200px] flex-col gap-10 px-4 py-16 md:gap-12 md:px-8 md:py-24 lg:py-28">
        <div className="max-w-2xl">
          {showEyebrow && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0] md:text-[12px]">
              The Silent Architect
            </p>
          )}
          <h1
            id="hero-heading"
            className={`text-balance text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-[44px] md:leading-tight lg:text-[2.75rem] lg:leading-[1.1] ${showEyebrow ? "mt-4" : "mt-2"}`}
          >
            Structure your day. Ship the work that matters.
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-[14px] leading-relaxed text-[#6B7280] md:text-[15px] lg:text-lg lg:leading-relaxed">
            Plan todos and events, run Pomodoro sessions, and keep tomorrow’s
            sequence clear — one calm workspace for focused productivity.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/todo/"
            className="inline-flex h-12 items-center justify-center rounded-md bg-[#1A1A1A] px-8 text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A]"
          >
            Open workspace
          </Link>
          <Link
            href="/events/"
            className="inline-flex h-12 items-center justify-center rounded-md border border-[#D1D5DB] bg-white px-8 text-sm font-semibold text-[#1A1A1A] transition-colors duration-200 hover:border-[#1A1A1A] hover:bg-[#FAFAF9] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A1A1A]"
          >
            Browse events
          </Link>
          <Link
            href="/todo/breakdown/"
            className="inline-flex h-12 items-center justify-center px-2 text-sm font-semibold text-[#6B7280] underline-offset-4 transition-colors duration-200 hover:text-[#1A1A1A] hover:underline sm:px-4"
          >
            Plan with Pomodoro
          </Link>
        </div>

        <ul className="grid gap-4 border-t border-[#E8EAED] pt-10 sm:grid-cols-3 sm:gap-6">
          <li>
            <p className="text-[13px] font-semibold text-[#1A1A1A]">Todos</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#6B7280]">
              Capture tasks and stay on top of what is next.
            </p>
          </li>
          <li>
            <p className="text-[13px] font-semibold text-[#1A1A1A]">Events</p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#6B7280]">
              Count down to deadlines and moments that anchor your week.
            </p>
          </li>
          <li>
            <p className="text-[13px] font-semibold text-[#1A1A1A]">
              Pomodoro flow
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-[#6B7280]">
              Break work into focused blocks and tomorrow’s sequence.
            </p>
          </li>
        </ul>
      </div>
    </section>
  );
}
