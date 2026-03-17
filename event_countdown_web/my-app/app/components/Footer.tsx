import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-white">
                P
              </div>
              <span className="text-sm font-semibold text-foreground">
                Pomodoro Planner
              </span>
            </div>
            <p className="mt-3 text-sm text-muted">
              Stay focused and organized with todos, events, and pomodoro
              sessions.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">Pages</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/todos"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Todos
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-sm text-muted transition-colors hover:text-foreground"
                >
                  Events
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground">App</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-muted">iOS (Coming Soon)</span>
              </li>
              <li>
                <span className="text-sm text-muted">
                  Android (Coming Soon)
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted">
          &copy; {new Date().getFullYear()} Pomodoro Planner. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
