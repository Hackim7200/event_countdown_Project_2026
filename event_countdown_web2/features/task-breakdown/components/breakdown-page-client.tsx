"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AppHeader } from "@/features/todo/components/app-header";
import { useTodo } from "@/features/todo/context/todo-context";
import type { DayTab } from "@/features/todo/types";
import { TodayTaskBreakdown } from "@/features/task-breakdown/components/today-task-breakdown";
import { TomorrowTaskBreakdown } from "@/features/task-breakdown/components/tomorrow-task-breakdown";
import "@/features/task-breakdown/styles/breakdown.css";

export function BreakdownPageClient() {
  const params = useSearchParams();
  const id = params.get("id");
  const { getTask } = useTodo();
  const task = id ? getTask(id) : undefined;

  if (!task) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-[#F8F9FA]">
        <AppHeader activeNav="todos" />
        <main className="mx-auto flex max-w-lg flex-1 flex-col items-center justify-center px-6 py-16 text-center">
          <p className="text-[15px] font-medium text-[#374151]">Task not found</p>
          <p className="mt-2 text-sm text-[#6B7280]">
            Return to your sequence to pick a task.
          </p>
          <Link
            href="/todo/"
            className="mt-8 rounded-full bg-[#4A5568] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Back to Todos
          </Link>
        </main>
      </div>
    );
  }

  const resolvedDay: DayTab = task.day;
  const showTimer = resolvedDay === "today";

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#F8F9FA]">
      <AppHeader activeNav="todos" showNotifications={showTimer} />
      <main className="tsa-task-breakdown flex-1">
        {resolvedDay === "today" ? (
          <TodayTaskBreakdown task={task} />
        ) : (
          <TomorrowTaskBreakdown task={task} />
        )}
      </main>
    </div>
  );
}
