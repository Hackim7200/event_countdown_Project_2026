"use client";

import Link from "next/link";
import type { Task } from "@/features/todo/types";

export function TaskCard({ task }: { task: Task }) {
  const { completedPomodoros, totalPomodoros } = task;
  const ratioLabel =
    totalPomodoros === 1
      ? `${completedPomodoros}/1 Pomodoro`
      : `${completedPomodoros}/${totalPomodoros} Pomodoros`;

  return (
    <Link
      href={`/todo/breakdown/?day=${task.day}&id=${encodeURIComponent(task.id)}`}
      className="group block rounded-lg border border-[#EEF0F3] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-200 hover:border-[#D1D5DB] hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] active:scale-[0.99]"
    >
      <p className="text-[15px] font-medium leading-snug text-[#1A1A1A]">
        {task.title}
      </p>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div
          className="flex flex-wrap items-center gap-1.5"
          aria-label={`Pomodoro progress ${ratioLabel}`}
        >
          {Array.from({ length: totalPomodoros }, (_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full ${
                i < completedPomodoros ? "bg-[#4A5568]" : "bg-[#E5E7EB]"
              }`}
            />
          ))}
        </div>
        <span className="text-[12px] text-[#A0A0A0]">{ratioLabel}</span>
      </div>
    </Link>
  );
}
