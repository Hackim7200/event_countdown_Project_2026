import Link from "next/link";

const lastUpdated = "March 20, 2026";

export function PrivacyScreen() {
  return (
    <article>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-zinc-950">
        Privacy policy
      </h1>
      <p className="mb-10 text-sm text-zinc-500">Last updated: {lastUpdated}</p>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Who we are
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          <span className="font-medium text-zinc-800">Pomodoro Planner</span>{" "}
          (“we,” “us,” or “our”) provides a productivity app and related web
          experience for managing todos and events. The organization responsible
          for your personal data is:{" "}
          <span className="font-medium text-zinc-800">
            [Your legal name / company]
          </span>
          , located at{" "}
          <span className="font-medium text-zinc-800">[Address]</span>.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Scope
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          This policy describes how we collect, use, store, and share information
          when you use our mobile applications (for example on iOS or Android),
          our website, and related services (together, the “Services”). If you do
          not agree with this policy, please do not use the Services.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Information we collect
        </h2>
        <div className="space-y-4 text-sm leading-relaxed text-zinc-600">
          <div>
            <p className="mb-2 font-medium text-zinc-800">
              Information you provide
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Account details such as name, email address, and authentication
                identifiers when you register or sign in (including through a
                third-party sign-in provider, if offered).
              </li>
              <li>
                Content you create in the Services, such as todo titles,
                descriptions, due dates, and event information you save.
              </li>
              <li>
                Communications you send us (for example support emails),
                including the contents of the message and associated metadata.
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-zinc-800">
              Information collected automatically
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>
                Device and app data such as device type, operating system,
                app version, language, and approximate region derived from IP
                address.
              </li>
              <li>
                Diagnostic and performance data such as crash logs and error
                reports, where enabled, to keep the Services reliable and secure.
              </li>
              <li>
                On the website, cookies and similar technologies may be used for
                essential functionality, preferences, or analytics. You can
                control cookies through your browser settings where applicable.
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-2 font-medium text-zinc-800">
              Information from third parties
            </p>
            <p>
              If you connect a third-party account or use features that rely on
              another service, we may receive information from that provider in
              accordance with their terms and your settings.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          How we use information
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-600">
          We use the information above to:
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-600">
          <li>Provide, operate, and improve the Services and your account.</li>
          <li>Sync and display your todos and events across devices where supported.</li>
          <li>Authenticate you, prevent fraud and abuse, and protect security.</li>
          <li>Respond to your requests and provide customer support.</li>
          <li>
            Send service-related notices (for example security or policy
            updates); where permitted, we may also send product updates you can
            opt out of.
          </li>
          <li>Comply with law and enforce our terms.</li>
          <li>
            Analyze usage in aggregate or de-identified form to understand how
            the Services are used, unless you opt out where such choice is
            offered.
          </li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
          Where required by law (for example in the EEA or UK), we rely on
          appropriate legal bases such as performance of a contract, legitimate
          interests that are not overridden by your rights, consent where we ask
          for it, or legal obligation.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          How we share information
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-600">
          We do not sell your personal information. We may share information:
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm text-zinc-600">
          <li>
            With service providers and subprocessors who host data, run
            infrastructure, provide analytics, email delivery, or customer
            support tools, bound by contractual obligations to protect data and
            use it only for our instructions.
          </li>
          <li>
            If we reorganize, merge, or sell assets, with notice where required
            by law.
          </li>
          <li>
            With law enforcement or others when we believe disclosure is required
            by law or necessary to protect rights, safety, or security.
          </li>
          <li>With your direction or consent.</li>
        </ul>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600">
          A current list of categories of subprocessors or a dedicated
          subprocessors page should be linked here when you maintain one.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Retention
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          We retain personal information for as long as your account is active or
          as needed to provide the Services, resolve disputes, and meet legal,
          accounting, or reporting requirements. When data is no longer needed, we
          delete or anonymize it in line with our retention schedules.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Security
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          We use reasonable technical and organizational measures designed to
          protect personal information. No method of transmission or storage is
          completely secure; we cannot guarantee absolute security.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          International transfers
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          We may process and store information in countries other than where you
          live. Where we transfer personal data across borders, we use
          appropriate safeguards such as standard contractual clauses or other
          mechanisms recognized by applicable law.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Your rights and choices
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-zinc-600">
          Depending on where you live, you may have the right to access, correct,
          delete, or export your personal data; object to or restrict certain
          processing; withdraw consent where processing is consent-based; and
          lodge a complaint with a supervisory authority. To exercise these
          rights, use the contact options we describe on our{" "}
          <Link
            href="/support"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-600"
          >
            Support
          </Link>{" "}
          page (or any other channel we publish). We may need to verify your
          identity before responding.
        </p>
        <p className="text-sm leading-relaxed text-zinc-600">
          California residents: Under the CCPA/CPRA, you may have rights to know
          what personal information we collect, delete certain information, and
          opt out of “sale” or “sharing” for cross-context behavioral advertising
          as those terms are defined by law. We do not sell personal information
          in the conventional sense; adjust this section if you use advertising
          or sale-related practices.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Children
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          The Services are not directed to children under 13 (or the minimum age
          in your jurisdiction). We do not knowingly collect personal
          information from children. If you believe we have collected such
          information, reach us through the options on our{" "}
          <Link
            href="/support"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-600"
          >
            Support
          </Link>{" "}
          page and we will take steps to delete it.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Third-party services
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          The Services may contain links or integrations to third-party sites or
          services. Their privacy practices are governed by their own policies; we
          are not responsible for their content or practices.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="mb-3 text-base font-semibold text-zinc-900">
          Changes to this policy
        </h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          We may update this policy from time to time. We will post the revised
          policy on this page and update the “Last updated” date. For material
          changes, we may provide additional notice as required by law.
        </p>
      </section>

      <section>
        <h2 className="mb-3 text-base font-semibold text-zinc-900">Contact</h2>
        <p className="text-sm leading-relaxed text-zinc-600">
          Questions about this policy or your personal data: we do not use a
          separate privacy email. For how to reach us, see{" "}
          <Link
            href="/support"
            className="font-medium text-zinc-900 underline decoration-zinc-300 underline-offset-4 transition-colors hover:decoration-zinc-600"
          >
            Support
          </Link>
          .
        </p>
      </section>
    </article>
  );
}
