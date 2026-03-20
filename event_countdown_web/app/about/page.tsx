import Navbar from "@/components/shared/Navbar";
import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6">
          About
        </h1>
        <div className="space-y-6 text-zinc-600 dark:text-zinc-400 leading-7">
          <p>
            Event Countdown is a simple app to help you keep track of upcoming
            events that matter to you — birthdays, deadlines, holidays, trips,
            or anything else worth counting down to.
          </p>
          <p>
            The app is available on iOS and as a web app. Your events sync
            securely to the cloud so you always have access across your devices.
          </p>
          <p>
            Built with Flutter for mobile and Next.js for the web, backed by
            AWS infrastructure.
          </p>
        </div>
        <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <Link
            href="/"
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-sm text-zinc-400 dark:text-zinc-600">
        <div className="flex items-center justify-center gap-4">
          <span>© {new Date().getFullYear()} Event Countdown</span>
          <Link href="/privacy" className="hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
