import Link from "next/link";

export function LandingScreen() {
  return (
    <div className="flex flex-col">
      <section className="pb-16 pt-4 sm:pb-20 sm:pt-8">
        <h1 className="max-w-lg text-3xl font-semibold leading-[1.15] tracking-tight text-zinc-950 sm:text-4xl">
          Todos and Events, without the noise.
        </h1>
        <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-500 sm:text-[17px]">
          Pomodoro Planner pairs <span className="text-zinc-700">Todos</span>{" "}
          (today and tomorrow) with{" "}
          <span className="text-zinc-700">Events</span> (past and upcoming) in
          one focused view.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link
            href="/todos"
            className="inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
          >
            Open Todos
          </Link>
          <Link
            href="/events"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-300 bg-white px-8 text-sm font-medium text-zinc-800 transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-400"
          >
            Browse Events
          </Link>
        </div>
      </section>

      <section
        className="border-t border-zinc-200 pt-12"
        aria-labelledby="landing-features-heading"
      >
        <h2 id="landing-features-heading" className="sr-only">
          Highlights
        </h2>
        <ul className="grid gap-10 sm:grid-cols-2 sm:gap-12">
          <li>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
              Todos
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Today and tomorrow tasks in one list — see what matters without
              digging through clutter.
            </p>
          </li>
          <li>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-400">
              Events
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Track Events from past to future in a single timeline so context
              stays clear.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
}
