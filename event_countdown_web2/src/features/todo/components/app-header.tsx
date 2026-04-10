"use client";

import Link from "next/link";

type NavKey = "todos" | "events";

export function AppHeader({
  activeNav,
  showNotifications = false,
  /** Bell, settings, and profile — matches Events toolbar in design. */
  showHeaderActions = false,
}: {
  activeNav: NavKey;
  showNotifications?: boolean;
  showHeaderActions?: boolean;
}) {
  return (
    <header className="border-b border-[#E8EAED] bg-white">
      <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 py-4 md:px-8 md:py-0 md:h-[72px]">
        <div className="flex min-w-0 justify-start">
          <Link
            href="/todo/"
            className="flex min-w-0 items-center gap-2 md:gap-3 transition-opacity duration-200 hover:opacity-80"
          >
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-[#1A1A1A] text-xs font-semibold text-white md:h-9 md:w-9 md:text-sm"
              aria-hidden
            >
              A
            </span>
            <span className="truncate text-[13px] font-semibold tracking-tight text-[#1A1A1A] md:text-[15px]">
              The Silent Architect
            </span>
          </Link>
        </div>

        <nav
          className="flex justify-center gap-6 md:gap-12"
          aria-label="Primary"
        >
          <Link
            href="/todo/"
            className={`relative pb-1 text-[11px] font-semibold tracking-[0.12em] transition-colors duration-200 md:text-[12px] ${
              activeNav === "todos"
                ? "text-[#1A1A1A] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-[#1A1A1A]"
                : "text-[#A0A0A0] hover:text-[#6B7280]"
            } `}
          >
            TODOS
          </Link>
          <Link
            href="/events/"
            className={`relative pb-1 text-[11px] font-semibold tracking-[0.12em] transition-colors duration-200 md:text-[12px] ${
              activeNav === "events"
                ? "text-[#1A1A1A] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-[#1A1A1A]"
                : "text-[#A0A0A0] hover:text-[#6B7280]"
            } `}
          >
            EVENTS
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-2 md:gap-4">
          {(showNotifications || showHeaderActions) && (
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-[#3E475E] transition-colors duration-200 hover:bg-[#F3F4F6] sm:flex"
              aria-label="Notifications"
            >
              <BellIcon className="h-5 w-5" />
            </button>
          )}
          {showHeaderActions && (
            <button
              type="button"
              className="hidden h-10 w-10 items-center justify-center rounded-full text-[#3E475E] transition-colors duration-200 hover:bg-[#F3F4F6] sm:flex"
              aria-label="Settings"
            >
              <GearIcon className="h-5 w-5" />
            </button>
          )}
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8D5C4] text-[#5C4A3A] transition-transform duration-200 hover:scale-[1.02] md:h-10 md:w-10"
            aria-label="Profile"
          >
            <UserIcon className="h-[18px] w-[18px] md:h-5 md:w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

function GearIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v1.5M12 21.5V23M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M1 12h1.5M21.5 12H23M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06" />
    </svg>
  );
}

function BellIcon({ className }: { className?: string }) {
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
      <path d="M18 8a6 6 0 10-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
