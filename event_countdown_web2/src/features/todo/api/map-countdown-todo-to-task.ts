import type { CountdownTodoDto } from "@/src/app/services/TodoService";
import { apiPeriodToTimeCategory } from "@/src/features/todo/api/time-period-map";
import type {
  DayTab,
  ExecutionStep,
  ExecutionStepStatus,
  PlannedBlock,
  Task,
} from "@/src/features/todo/types";

function buildExecutionSteps(
  total: number,
  completedPomodoros: number,
  isCompleted: boolean,
): ExecutionStep[] {
  const n = Math.max(1, total);
  const done = isCompleted
    ? n
    : Math.min(Math.max(0, completedPomodoros), n);
  return Array.from({ length: n }, (_, i) => {
    let status: ExecutionStepStatus;
    if (i < done) status = "completed";
    else if (i === done && !isCompleted) status = "active";
    else status = "pending";
    return {
      id: `exec-${i}`,
      title: `Pomodoro ${String(i + 1)}`,
      meta:
        status === "completed"
          ? "COMPLETED • 25M"
          : status === "active"
            ? "CURRENT • 25M"
            : "PENDING • 25M EST.",
      status,
    };
  });
}

function buildPlannedBlocks(total: number): PlannedBlock[] {
  return Array.from({ length: Math.max(1, total) }, (_, i) => ({
    id: `pb-${i}`,
    indexLabel: String(i + 1).padStart(2, "0"),
    title: `Focus block ${String(i + 1).padStart(2, "0")}`,
    description: "Define the intent for this Pomodoro block.",
  }));
}

function rawDateFromDto(dto: CountdownTodoDto): string {
  const s = (dto.date ?? dto.dueDate ?? "").trim();
  if (s.length >= 10) return s.slice(0, 10);
  return s;
}

export function countdownTodoToTask(dto: CountdownTodoDto, day: DayTab): Task {
  const rawDate = rawDateFromDto(dto);
  const category = apiPeriodToTimeCategory(dto.timePeriod ?? "Morning");
  const total = Math.max(1, dto.pomodoros ?? 1);
  const isCompleted = dto.completed === true;
  const completedPomodoros = isCompleted ? total : 0;

  const base: Task = {
    id: dto.id,
    title: dto.title,
    day,
    category,
    completedPomodoros,
    totalPomodoros: total,
    serverRawDate: rawDate,
  };

  if (day === "today") {
    base.executionSteps = buildExecutionSteps(
      total,
      completedPomodoros,
      isCompleted,
    );
  } else {
    base.description = "Planned sequence from your backlog.";
    base.plannedBlocks = buildPlannedBlocks(total);
  }

  return base;
}
