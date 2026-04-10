"use client";

import type { ExecutionStep } from "@/src/features/todo/types";

export function ExecutionStepCard({ step }: { step: ExecutionStep }) {
  if (step.status === "completed") {
    return (
      <article className="flex gap-4 rounded-xl border border-[#EEF0F3] bg-white p-4 md:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#D1D5DB] text-[#9CA3AF]">
          <CheckIcon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] text-[#9CA3AF] line-through">
            {step.title}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[#C4C4C4]">
            {step.meta}
          </p>
        </div>
      </article>
    );
  }

  if (step.status === "active") {
    return (
      <article className="flex gap-4 rounded-xl border-2 border-[#C5CED8] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)] md:p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#3E475E] text-white">
          <PlaySmallIcon className="ml-0.5 h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold text-[#1A1A1A]">
            {step.title}
          </p>
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
            {step.meta}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 text-[#6B7280]">
          <button
            type="button"
            className="rounded-md p-2 transition-colors hover:bg-[#F3F4F6]"
            aria-label="Pause"
          >
            <PauseIcon className="h-5 w-5" />
          </button>
          <span className="text-[#9CA3AF]" aria-hidden>
            <DragHandleIcon className="h-5 w-5" />
          </span>
        </div>
      </article>
    );
  }

  return (
    <article className="flex gap-4 rounded-xl border border-[#EEF0F3] bg-white p-4 md:p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center">
        <span className="h-5 w-5 rounded-full border-2 border-[#D1D5DB]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium text-[#1A1A1A]">{step.title}</p>
        <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
          {step.meta}
        </p>
      </div>
    </article>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function PlaySmallIcon({ className }: { className?: string }) {
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

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function DragHandleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <circle cx="9" cy="8" r="1.35" />
      <circle cx="15" cy="8" r="1.35" />
      <circle cx="9" cy="12" r="1.35" />
      <circle cx="15" cy="12" r="1.35" />
      <circle cx="9" cy="16" r="1.35" />
      <circle cx="15" cy="16" r="1.35" />
    </svg>
  );
}
