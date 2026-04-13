"use client";

import type { Task } from "@/src/features/todo/types";
import { PomodoroSession } from "@/src/features/pomodoro/components/pomodoro-session";

/** Today: full Pomodoro flow (REST + WebSocket), aligned with Flutter `PomodoroScreen`. */
export function TodayTaskBreakdown({ task }: { task: Task }) {
  return <PomodoroSession todoId={task.id} taskTitle={task.title} />;
}
