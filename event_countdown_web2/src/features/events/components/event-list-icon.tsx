import type { EventIconKind } from "../types";

export function EventListIcon({
  kind,
  className = "h-5 w-5 text-[#5C6570]",
}: {
  kind: EventIconKind;
  className?: string;
}) {
  switch (kind) {
    case "easel":
      return <EaselIcon className={className} />;
    case "clipboard":
      return <ClipboardIcon className={className} />;
    case "upload":
      return <UploadSquareIcon className={className} />;
    case "calendar":
      return <CalendarIcon className={className} />;
    case "users":
      return <UsersIcon className={className} />;
    case "blueprint":
      return <BlueprintIcon className={className} />;
    case "archive":
      return <ArchiveIcon className={className} />;
    case "clock":
      return <ClockIcon className={className} />;
    case "map":
      return <MapIcon className={className} />;
    case "phone":
      return <PhoneIcon className={className} />;
    default:
      return <CalendarIcon className={className} />;
  }
}

function EaselIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 20h16" />
      <path d="M8 20l1-4h6l1 4" />
      <path d="M7 16h10l2-10H5l2 10z" />
      <path d="M12 6V4" />
    </svg>
  );
}

function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 4h6a1 1 0 011 1v1H8V5a1 1 0 011-1z" />
      <path d="M8 6h8v14a2 2 0 01-2 2H10a2 2 0 01-2-2V6z" />
      <path d="M10 11h4M10 15h4" />
    </svg>
  );
}

function UploadSquareIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M12 16V8M9 11l3-3 3 3" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M17 21v-2a4 4 0 00-3-3.87M9 21v-2a4 4 0 013-3.87m0-9.13a3 3 0 100-6 3 3 0 000 6z" />
      <path d="M21 21v-2a4 4 0 00-3-3.87M3 21v-2a4 4 0 013-3.87" />
    </svg>
  );
}

function BlueprintIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 20V4h16v16H4z" />
      <path d="M4 12h16M12 4v16M8 8h.01M16 16h.01M8 16h.01M16 8h.01" />
    </svg>
  );
}

function ArchiveIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 7h16v3H4zM9 10h6M10 13h4" />
      <path d="M5 7l1-3h12l1 3v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7z" />
    </svg>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function MapIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6.5 3h4l2 5-2 1a12 12 0 006 6l1-2 5 2v4a2 2 0 01-2 2A16 16 0 013 8.5 2 2 0 012-2z" />
    </svg>
  );
}
