"use client";

import {
  TIME_CATEGORIES,
  type Task,
  type TimeCategoryId,
} from "@/src/features/todo/types";
import { CategoryIcon } from "@/src/features/today/components/category-icon";
import { TaskCard } from "@/src/features/today/components/task-card";

export function TimeCategoryColumn({
  categoryId,
  tasks,
}: {
  categoryId: TimeCategoryId;
  tasks: Task[];
}) {
  const meta = TIME_CATEGORIES.find((c) => c.id === categoryId);
  if (!meta) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <CategoryIcon
          icon={meta.icon}
          className="h-5 w-5 shrink-0 text-[#1A1A1A]"
        />
        <h2 className="flex-1 text-[15px] font-semibold text-[#1A1A1A]">
          {meta.label}
        </h2>
        <span className="shrink-0 rounded-full bg-[#EEF1F4] px-3 py-1 text-[11px] font-medium tracking-wide text-[#6B7280]">
          {meta.range}
        </span>
      </div>
      <div className="flex flex-col gap-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </section>
  );
}
