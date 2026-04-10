"use client";

import type { PlannedBlock } from "@/src/features/todo/types";

export function PlannedPomodoroCard({ block }: { block: PlannedBlock }) {
  return (
    <article className="flex gap-4 rounded-xl border border-[#EEF0F3] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:gap-6 md:p-6">
      <span className="w-10 shrink-0 text-2xl font-semibold text-[#D1D5DB] md:w-12 md:text-3xl">
        {block.indexLabel}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-[16px] font-semibold text-[#374151]">
          {block.title}
        </h3>
        <p className="mt-2 text-[14px] leading-relaxed text-[#6B7280]">
          {block.description}
        </p>
      </div>
    </article>
  );
}
