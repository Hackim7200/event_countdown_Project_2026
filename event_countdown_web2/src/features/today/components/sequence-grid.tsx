"use client";

import { useMemo } from "react";
import "@/src/features/today/styles/today.css";
import "@/src/features/tomorrow/styles/tomorrow.css";
import {
  TIME_CATEGORIES,
  type DayTab,
  type Task,
  type TimeCategoryId,
} from "@/src/features/todo/types";
import { TimeCategoryColumn } from "@/src/features/today/components/time-category-column";

const COLUMN_GROUPS: TimeCategoryId[][] = [
  ["morning", "earlyAfternoon"],
  ["lateAfternoon", "twilight"],
  ["night"],
];

export function SequenceGrid({ day, tasks }: { day: DayTab; tasks: Task[] }) {
  const byCategory = useMemo(() => {
    const map = new Map<TimeCategoryId, Task[]>();
    for (const c of TIME_CATEGORIES) {
      map.set(
        c.id,
        tasks.filter((t) => t.category === c.id && t.day === day),
      );
    }
    return map;
  }, [day, tasks]);

  const surface =
    day === "today" ? "tsa-today-sequence" : "tsa-tomorrow-sequence";

  return (
    <div
      className={`${surface} grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-0`}
    >
      {COLUMN_GROUPS.map((group, colIndex) => (
        <div key={colIndex} className="flex flex-col gap-10">
          {group.map((categoryId) => (
            <TimeCategoryColumn
              key={categoryId}
              categoryId={categoryId}
              tasks={byCategory.get(categoryId) ?? []}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
