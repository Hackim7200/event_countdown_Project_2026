"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createInitialTasks,
  DEFAULT_TODAY_EXECUTION_STEPS,
  type DayTab,
  type Task,
  type TimeCategoryId,
} from "@/features/todo/types";

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function defaultExecutionSteps(): Task["executionSteps"] {
  return DEFAULT_TODAY_EXECUTION_STEPS.map((s, i) => ({
    ...s,
    id: `exec-${newId()}-${i}`,
  }));
}

function emptyPlannedBlocks(count: number): Task["plannedBlocks"] {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, "0");
    return {
      id: `pb-${newId()}-${i}`,
      indexLabel: n,
      title: `Focus block ${n}`,
      description: "Define the intent for this Pomodoro block.",
    };
  });
}

interface TodoContextValue {
  tasks: Task[];
  addTask: (input: {
    day: DayTab;
    category: TimeCategoryId;
    title: string;
    totalPomodoros: number;
  }) => void;
  getTask: (id: string) => Task | undefined;
}

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(() => createInitialTasks());

  const addTask = useCallback(
    (input: {
      day: DayTab;
      category: TimeCategoryId;
      title: string;
      totalPomodoros: number;
    }) => {
      const trimmed = input.title.trim();
      if (!trimmed) return;

      setTasks((prev) => {
        const id = newId();
        const base: Task = {
          id,
          title: trimmed,
          day: input.day,
          category: input.category,
          completedPomodoros: 0,
          totalPomodoros: Math.max(1, input.totalPomodoros),
        };

        if (input.day === "today") {
          base.executionSteps = defaultExecutionSteps();
        } else {
          base.description =
            "Outline the objective and constraints for this sequence.";
          base.plannedBlocks = emptyPlannedBlocks(base.totalPomodoros);
        }

        return [...prev, base];
      });
    },
    [],
  );

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks],
  );

  const value = useMemo(
    () => ({ tasks, addTask, getTask }),
    [tasks, addTask, getTask],
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodo() {
  const ctx = useContext(TodoContext);
  if (!ctx) {
    throw new Error("useTodo must be used within TodoProvider");
  }
  return ctx;
}
