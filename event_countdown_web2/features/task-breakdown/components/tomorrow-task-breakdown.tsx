"use client";

import type { Task } from "@/features/todo/types";
import { PlannedPomodoroCard } from "@/features/task-breakdown/components/planned-pomodoro-card";

function formatTomorrowHeadingDate(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
    .format(d)
    .toUpperCase();
}

export function TomorrowTaskBreakdown({ task }: { task: Task }) {
  const blocks = task.plannedBlocks ?? [];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateLine = formatTomorrowHeadingDate(tomorrow);

  return (
    <div className="mx-auto w-full max-w-[800px] px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-md bg-[#93C5FD] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white">
          Tomorrow
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A0A0A0]">
          {dateLine}
        </span>
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-[#374151] md:text-[34px]">
        {task.title}
      </h1>
      {task.description ? (
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#6B7280]">
          {task.description}
        </p>
      ) : null}

      <section className="mt-12 md:mt-14">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">
            Planned Pomodoros
          </h2>
          <button
            type="button"
            className="text-[11px] font-semibold uppercase tracking-wide text-[#6B7280] transition-colors hover:text-[#374151]"
          >
            ⊕ Add Block
          </button>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {blocks.map((b) => (
            <PlannedPomodoroCard key={b.id} block={b} />
          ))}
        </div>
        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-transparent py-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280] transition-colors duration-200 hover:border-[#9CA3AF] hover:bg-[#F9FAFB] min-h-[56px]"
        >
          <AppendIcon className="h-6 w-6 text-[#6B7280]" />
          Append Next Sequence
        </button>
      </section>

      <p className="mt-16 text-center text-[10px] font-medium uppercase tracking-[0.24em] text-[#C4C4C4]">
        THE SILENT ARCHITECT — SYSTEM VERSION 4.2.0
      </p>
    </div>
  );
}

function AppendIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
      <path d="M8 18l-2 2" opacity="0.55" />
    </svg>
  );
}
