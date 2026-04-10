"use client";

import type { Task } from "@/src/features/todo/types";
import { PomodoroTimer } from "@/src/features/pomodoro/components/pomodoro-timer";
import { ExecutionStepCard } from "@/src/features/task-breakdown/components/execution-step-card";

export function TodayTaskBreakdown({ task }: { task: Task }) {
  const steps = task.executionSteps ?? [];

  return (
    <div className="mx-auto w-full max-w-[800px] px-4 py-10 md:px-6 md:py-14">
      <div className="md:mt-4">
        <PomodoroTimer />
      </div>

      <section className="mt-14 md:mt-20">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[17px] font-semibold text-[#1A1A1A]">
            Execution Steps
          </h2>
          <span className="rounded-full bg-[#EEF1F4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
            {steps.length} Pomodoros
          </span>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          {steps.map((step) => (
            <ExecutionStepCard key={step.id} step={step} />
          ))}
        </div>
        <button
          type="button"
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#D1D5DB] bg-transparent py-5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#6B7280] transition-colors duration-200 hover:border-[#9CA3AF] hover:bg-[#F9FAFB] min-h-[56px]"
        >
          <PlusCheckIcon className="h-6 w-6 text-[#6B7280]" />
          ADD POMODORO
        </button>
      </section>
    </div>
  );
}

function PlusCheckIcon({ className }: { className?: string }) {
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
      <path d="M16 18l2 2" opacity="0.6" />
    </svg>
  );
}
