import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
          <span className="mb-4 inline-block rounded-full bg-primary-light px-4 py-1.5 text-xs font-semibold text-primary">
            Productivity made simple
          </span>
          <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-foreground">
            Plan your day.
            <br />
            <span className="text-primary">Stay focused.</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-muted">
            Manage your todos, track events with countdowns, and use pomodoro
            sessions to get things done — all in one place.
          </p>
          <div className="mt-10 flex gap-4">
            <Link
              href="/todos"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-hover"
            >
              Open Todos
            </Link>
            <Link
              href="/events"
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-gray-50"
            >
              View Events
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-2xl font-bold text-foreground">
            Everything you need to stay productive
          </h2>
          <p className="mx-auto mt-3 max-w-md text-center text-sm text-muted">
            Three simple tools that work together to keep you on track.
          </p>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            <FeatureCard
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              }
              title="Todos"
              description="Organize tasks by today and tomorrow. Mark them complete as you go."
            />
            <FeatureCard
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              }
              title="Events"
              description="Track upcoming and past events with live countdowns to what matters."
            />
            <FeatureCard
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              }
              title="Pomodoros"
              description="Stay in the zone with focused work sessions tied to your tasks."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-light text-primary">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted">{description}</p>
    </div>
  );
}
