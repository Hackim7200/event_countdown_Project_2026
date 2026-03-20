import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-zinc-200 pt-8">
      <div className="flex flex-col gap-3 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {year} Pomodoro Planner</p>
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          <Link
            href="/support"
            className="text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Support
          </Link>
          <Link
            href="/privacy"
            className="text-zinc-600 transition-colors hover:text-zinc-900"
          >
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
