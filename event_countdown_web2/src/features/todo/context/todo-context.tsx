"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createCountdownTodo,
  fetchCountdownTodosForDate,
} from "@/src/app/services/TodoService";
import { countdownTodoToTask } from "@/src/features/todo/api/map-countdown-todo-to-task";
import { timeCategoryToApiPeriod } from "@/src/features/todo/api/time-period-map";
import type { DayTab, Task, TimeCategoryId } from "@/src/features/todo/types";

function startOfLocalDay(base = new Date()): Date {
  return new Date(base.getFullYear(), base.getMonth(), base.getDate());
}

function addLocalDays(d: Date, days: number): Date {
  const x = new Date(d.getTime());
  x.setDate(x.getDate() + days);
  return x;
}

interface TodoContextValue {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  refreshTasks: () => Promise<void>;
  addTask: (input: {
    day: DayTab;
    category: TimeCategoryId;
    title: string;
  }) => Promise<void>;
  getTask: (id: string) => Task | undefined;
}

const TodoContext = createContext<TodoContextValue | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshTasks = useCallback(async () => {
    setError(null);
    const today0 = startOfLocalDay();
    const tomorrow0 = addLocalDays(today0, 1);
    try {
      const [todayDtos, tomorrowDtos] = await Promise.all([
        fetchCountdownTodosForDate(today0),
        fetchCountdownTodosForDate(tomorrow0),
      ]);
      setTasks([
        ...todayDtos.map((d) => countdownTodoToTask(d, "today")),
        ...tomorrowDtos.map((d) => countdownTodoToTask(d, "tomorrow")),
      ]);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Could not load tasks from the server.";
      setError(msg);
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      await refreshTasks();
      if (!cancelled) setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refreshTasks]);

  const addTask = useCallback(
    async (input: {
      day: DayTab;
      category: TimeCategoryId;
      title: string;
    }) => {
      const trimmed = input.title.trim();
      if (!trimmed) return;

      const dueDate =
        input.day === "today" ? startOfLocalDay() : addLocalDays(startOfLocalDay(), 1);

      await createCountdownTodo({
        title: trimmed,
        dueDate,
        timePeriod: timeCategoryToApiPeriod(input.category),
      });

      await refreshTasks();
    },
    [refreshTasks],
  );

  const getTask = useCallback(
    (id: string) => tasks.find((t) => t.id === id),
    [tasks],
  );

  const value = useMemo(
    () => ({
      tasks,
      isLoading,
      error,
      refreshTasks,
      addTask,
      getTask,
    }),
    [tasks, isLoading, error, refreshTasks, addTask, getTask],
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
