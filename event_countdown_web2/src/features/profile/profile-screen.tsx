"use client";

import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { AppHeader } from "@/src/features/todo/components/app-header";

const APP_VERSION = "0.1.0";

function displayNameFromAttributes(attrs: Record<string, string>): string {
  const name = attrs.name?.trim();
  if (name) return name;
  const given = attrs.given_name?.trim();
  const family = attrs.family_name?.trim();
  if (given || family) return [given, family].filter(Boolean).join(" ");
  const email = attrs.email;
  if (email) {
    const local = email.split("@")[0] ?? "";
    if (local) {
      return local
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  }
  return "Member";
}

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
  }
  if (parts.length === 1 && parts[0]!.length >= 2) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase() || "?";
}

export function ProfileScreen() {
  const [attrs, setAttrs] = useState<Record<string, string>>({});
  const [loadingAttrs, setLoadingAttrs] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const raw = await fetchUserAttributes();
        if (cancelled) return;
        setAttrs(raw as Record<string, string>);
      } catch {
        if (!cancelled) setError("Could not load profile details.");
      } finally {
        if (!cancelled) setLoadingAttrs(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = useMemo(() => displayNameFromAttributes(attrs), [attrs]);
  const email = attrs.email ?? attrs.preferred_username ?? null;
  const initials = useMemo(
    () => initialsFromName(displayName || email || "M"),
    [displayName, email],
  );

  const handleSignOut = useCallback(async () => {
    setError(null);
    setSigningOut(true);
    try {
      await signOut();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Sign out failed.");
      setSigningOut(false);
    }
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#F8F9FA]">
      <AppHeader activeNav="profile" showHeaderActions />
      <main className="relative flex-1 pb-28">
        <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-8 md:py-10">
          <div className="mx-auto max-w-3xl">
            {/* Profile header */}
            <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
              <div className="relative shrink-0">
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-[#E8EEF3] text-2xl font-semibold tracking-tight text-[#4B5563] shadow-[0_1px_2px_rgba(15,23,42,0.06)] md:h-32 md:w-32 md:text-3xl">
                  {loadingAttrs ? (
                    <span className="text-sm font-medium text-[#9CA3AF]">
                      …
                    </span>
                  ) : (
                    initials
                  )}
                </div>
                <button
                  type="button"
                  className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-lg border border-[#E8EAED] bg-white text-[#4A5568] shadow-sm transition-colors hover:bg-[#F9FAFB]"
                  aria-label="Profile photo is managed in the mobile app"
                  title="Profile photo is managed in the mobile app"
                >
                  <CameraIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="min-w-0 flex-1">
                {loadingAttrs ? (
                  <p className="text-[15px] text-[#6B7280]">Loading profile…</p>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A] md:text-3xl md:leading-tight">
                      {displayName}
                    </h1>
                    {email ? (
                      <p className="mt-2 text-[15px] text-[#6B7280]">{email}</p>
                    ) : (
                      <p className="mt-2 text-[15px] text-[#6B7280]">
                        Signed in
                      </p>
                    )}
                    <div className="mt-6">
                      <Link
                        href="/support/"
                        className="inline-flex items-center gap-2 rounded-lg bg-[#4A5568] px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                      >
                        <PencilIcon className="h-4 w-4 shrink-0" />
                        Edit profile
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>

            {error ? (
              <p className="mt-8 text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            {/* System controls */}
            <section className="mt-14 md:mt-16">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                System controls
              </p>
              <div className="mt-3 flex items-center gap-4">
                <h2 className="shrink-0 text-lg font-bold text-[#1A1A1A] md:text-xl">
                  Privacy &amp; security
                </h2>
                <div
                  className="h-px min-w-0 flex-1 bg-[#E4E7EA]"
                  aria-hidden
                />
              </div>
              <ul className="mt-6 flex flex-col gap-3">
                <li>
                  <SystemControlRow
                    href="/privacy/"
                    title="Data privacy"
                    description="How we handle data and your privacy policy."
                    icon={<ShieldIcon className="h-5 w-5 text-[#4B5563]" />}
                  />
                </li>
                <li>
                  <SystemControlRow
                    href="/support/"
                    title="Help &amp; support"
                    description="Get help with todos, events, and sync."
                    icon={<EyeIcon className="h-5 w-5 text-[#4B5563]" />}
                  />
                </li>
                <li>
                  <SystemControlRow
                    href="/"
                    title="Workspace home"
                    description="Landing page and entry to todos, events, and Pomodoro flow."
                    icon={<LayersIcon className="h-5 w-5 text-[#4B5563]" />}
                  />
                </li>
              </ul>
            </section>

            {/* Philosophy */}
            <article className="relative mt-10 overflow-hidden rounded-xl border border-[#E8EAED] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.06)] md:mt-12 md:p-8">
              <div
                className="pointer-events-none absolute -right-8 top-1/2 hidden h-40 w-32 -translate-y-1/2 rounded-lg bg-[#F0F2F5] md:block"
                aria-hidden
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                Philosophy
              </p>
              <h3 className="relative mt-3 max-w-xl text-xl font-bold tracking-tight text-[#1A1A1A] md:text-2xl">
                Productivity through architectural thinking.
              </h3>
              <div className="relative mt-4 max-w-2xl space-y-4 text-[14px] leading-relaxed text-[#6B7280] md:text-[15px]">
                <p>
                  Structure your day as a sequence: todos for execution, events
                  for milestones, and Pomodoro blocks for deep work. The web
                  workspace stays aligned with Event Countdown on iOS and
                  Android.
                </p>
                <p>
                  Calm surfaces and clear hierarchy reduce noise so you can ship
                  the work that matters—one block at a time.
                </p>
              </div>
            </article>

            {/* Logout */}
            <div className="mt-12 border-t border-[#E8EAED] pt-8 md:mt-14 md:pt-10">
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                aria-label={signingOut ? "Signing out" : "Log out"}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-red-600 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <LogoutIcon className="h-4 w-4 shrink-0" aria-hidden />
                {signingOut ? "Signing out…" : "Log out"}
              </button>
              <p className="mt-8 text-[10px] font-medium uppercase tracking-[0.18em] text-[#A0A0A0]">
                The Silent Architect — version {APP_VERSION} stable
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SystemControlRow({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg bg-[#F0F2F5] px-4 py-4 transition-colors hover:bg-[#E8EBEF] md:gap-5 md:px-5 md:py-[18px]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white shadow-[0_1px_2px_rgba(15,23,42,0.05)] md:h-12 md:w-12">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-semibold text-[#1A1A1A]">{title}</p>
        <p className="mt-0.5 text-[13px] leading-snug text-[#6B7280] md:text-[14px]">
          {description}
        </p>
      </div>
      <ChevronIcon className="h-5 w-5 shrink-0 text-[#9CA3AF]" aria-hidden />
    </Link>
  );
}

function PencilIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );
}
