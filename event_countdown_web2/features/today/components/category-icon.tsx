import type { TimeCategoryMeta } from "@/features/todo/types";

export function CategoryIcon({
  icon,
  className = "h-5 w-5 text-[#1A1A1A]",
}: {
  icon: TimeCategoryMeta["icon"];
  className?: string;
}) {
  switch (icon) {
    case "sun":
      return <SunIcon className={className} />;
    case "sunRays":
      return <SunRaysIcon className={className} />;
    case "sunLow":
      return <SunLowIcon className={className} />;
    case "coffee":
      return <CoffeeIcon className={className} />;
    case "moon":
      return <MoonIcon className={className} />;
    default:
      return <SunIcon className={className} />;
  }
}

function SunIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function SunRaysIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="4" />
      <path d="M12 1v3M12 20v3M2 12h3M19 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
      <path d="M12 7V5M12 19v-2" opacity="0.5" />
    </svg>
  );
}

function SunLowIcon({ className }: { className?: string }) {
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
      <path d="M3 18h18" />
      <path d="M6 18a6 6 0 0112 0" />
      <path d="M10 10a2 2 0 104 0 2 2 0 00-4 0z" />
      <path d="M17 8l1-1M19 6l1-1" />
    </svg>
  );
}

function CoffeeIcon({ className }: { className?: string }) {
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
      <path d="M18 8h1a4 4 0 010 8h-1" />
      <path d="M6 4h10a2 2 0 012 2v8a4 4 0 01-4 4H8a4 4 0 01-4-4V6a2 2 0 012-2z" />
      <path d="M6 20h8" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
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
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
