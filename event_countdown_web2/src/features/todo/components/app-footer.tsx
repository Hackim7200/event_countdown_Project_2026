import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="mt-auto bg-[#F8F9FA] pt-10 pb-8 md:pt-12 md:pb-10">
      <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
        <div className="relative flex w-full items-center justify-center">
          <span className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-[#E4E7EA]" />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#F8F9FA] text-[#C4C9D0]">
            <GearIcon className="h-4 w-4" aria-hidden />
            <span className="sr-only">Workspace settings</span>
          </span>
        </div>
        <nav
          className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          aria-label="Legal and support"
        >
          <Link
            href="/support/"
            className="text-[13px] font-medium text-[#6B7280] transition-colors duration-200 hover:text-[#1A1A1A]"
          >
            Support
          </Link>
          <Link
            href="/privacy/"
            className="text-[13px] font-medium text-[#6B7280] transition-colors duration-200 hover:text-[#1A1A1A]"
          >
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}

function GearIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}
