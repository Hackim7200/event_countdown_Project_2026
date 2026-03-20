import Link from "next/link";

export function SupportScreen() {
  return (
    <article>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-zinc-950">
        Support
      </h1>
      <p className="mb-10 text-sm text-zinc-500">
        Help with Pomodoro Planner — todos, events, sign-in, and sync across
        mobile and web.
      </p>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Getting in touch
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          We don&apos;t operate a public support email at the moment. The
          sections below cover the most common problems. If the app or store
          listing offers another way to reach us (for example in-app feedback),
          use that when you need direct help.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Try this first
        </h2>
        <ul className="space-y-3 text-sm leading-relaxed text-zinc-600">
          <li>
            <span className="font-medium text-zinc-800">Update the app</span> —
            Install the latest version from the App Store or Google Play; on the
            web, try a hard refresh or another browser.
          </li>
          <li>
            <span className="font-medium text-zinc-800">Check connectivity</span>{" "}
            — Many sync and sign-in issues clear up once the device has a stable
            connection.
          </li>
          <li>
            <span className="font-medium text-zinc-800">Note what happened</span>{" "}
            — Short steps (“opened Todos → tapped … → saw …”) help us narrow
            down the problem.
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Common topics
        </h2>
        <ul className="space-y-4 text-sm leading-relaxed text-zinc-600">
          <li>
            <span className="font-medium text-zinc-800">Sign-in problems</span> —
            Use “Forgot password” or your provider’s account recovery if
            available. If you sign in with a social or SSO provider, confirm that
            account is active and authorized for this app.
          </li>
          <li>
            <span className="font-medium text-zinc-800">Sync or missing data</span>{" "}
            — Ensure you are signed into the same account on each device. Check
            the network, wait a moment for sync, then try signing out and back
            in. If items are still missing, note roughly when it started and what
            changed (e.g. new phone, OS update) for when you can report it.
          </li>
          <li>
            <span className="font-medium text-zinc-800">Todos and events</span> —
            Todos focus on what you need today and tomorrow; events cover a
            broader timeline. If something appears in the wrong place, describe
            the dates and titles you expected versus what you see.
          </li>
          <li>
            <span className="font-medium text-zinc-800">Feature requests</span> —
            When you have a way to send feedback, we read it. We can&apos;t
            promise a timeline, but it shapes what we build next.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-zinc-900">Privacy</h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          For how we collect, use, and share personal data, see our{" "}
          <Link
            href="/privacy"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-600"
          >
            privacy policy
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
