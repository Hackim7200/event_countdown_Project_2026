"use client";

/**
 * Top / bottom chrome inside Amplify Authenticator `RouteContainer`
 * (above the sign-in · sign-up tabs).
 */
export function AuthenticatorChromeHeader() {
  return (
    <header className="mb-8 flex flex-col items-center text-center">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-md bg-[#1A1A1A] text-sm font-semibold text-white"
        aria-hidden
      >
        A
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
        The Silent Architect
      </p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-[#6B7280]">
        Sign in or create an account to sync todos, events, and Pomodoro
        sessions.
      </p>
    </header>
  );
}

export function AuthenticatorChromeFooter() {
  return (
    <p className="mt-6 text-center text-[12px] text-[#A0A0A0]">
      Same workspace as Event Countdown on iOS and Android.
    </p>
  );
}
