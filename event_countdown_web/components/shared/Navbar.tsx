import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
        <Link
          href="/todos"
          className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight"
        >
          Event Countdown
        </Link>
        <div className="flex items-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <Link
            href="/events"
            className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            Events
          </Link>
          <Link
            href="/todos"
            className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            Todos
          </Link>
          <Link
            href="/about"
            className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            About
          </Link>
          <Link
            href="/privacy"
            className="hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            Privacy
          </Link>
        </div>
      </div>
    </nav>
  );
}
