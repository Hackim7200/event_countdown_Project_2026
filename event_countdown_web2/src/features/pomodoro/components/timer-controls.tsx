"use client";

export function TimerControls() {
  return (
    <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
      <button
        type="button"
        className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#3E475E] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#323a4f] active:scale-[0.99] sm:flex-none sm:min-w-[180px]"
      >
        <PlayIcon className="h-4 w-4" />
        Start Session
      </button>
      <button
        type="button"
        className="inline-flex flex-1 items-center justify-center rounded-full bg-[#D1DCE5] px-6 py-3.5 text-sm font-semibold text-[#3E475E] transition-colors duration-200 hover:bg-[#c3cfda] active:scale-[0.99] sm:flex-none sm:min-w-[140px]"
      >
        Reset
      </button>
    </div>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
