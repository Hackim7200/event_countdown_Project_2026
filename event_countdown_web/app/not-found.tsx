import Link from "next/link";
import { AppShell } from "@/features/shared/components/app-shell";

export default function NotFound() {
  return (
    <AppShell>
      <div className="py-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-400">
          404
        </p>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-950">
          Page not found
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600">
          That link may be outdated or the page was moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center justify-center rounded-md bg-zinc-900 px-8 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Back to home
        </Link>
      </div>
    </AppShell>
  );
}
