import Navbar from "@/components/shared/Navbar";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 mx-auto max-w-2xl px-6 py-20">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-zinc-400 dark:text-zinc-600 mb-10">
          Last updated: March 2026
        </p>

        <div className="space-y-10 text-zinc-600 dark:text-zinc-400 leading-7">
          <section>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
              Information We Collect
            </h2>
            <p>
              We collect only the information necessary to provide the app. This
              includes your account details (email address) and the event data
              you create within the app. We do not sell or share your data with
              third parties.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
              How We Use Your Data
            </h2>
            <p>
              Your data is used solely to provide and improve the Event
              Countdown service — storing your events, syncing across devices,
              and authenticating your account. We do not use your data for
              advertising.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
              Data Storage
            </h2>
            <p>
              Your data is stored securely on AWS infrastructure. All data is
              encrypted in transit and at rest. Access is restricted to your
              account only.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
              Your Rights
            </h2>
            <p>
              You can delete your account and all associated data at any time
              from within the app. If you have any questions or requests
              regarding your data, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-200 mb-3">
              Contact
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please reach
              out through the app or via the contact details on our About page.
            </p>
          </section>
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
        <span>© {new Date().getFullYear()} Event Countdown</span>
      </footer>
    </div>
  );
}
