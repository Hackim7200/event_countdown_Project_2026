"use client";

import Navbar from "@/components/shared/Navbar";
import { useState, useEffect } from "react";

const POMODORO_MINUTES = 25;
const SHORT_BREAK_MINUTES = 5;

type TimerMode = "focus" | "break";

interface Task {
  id: number;
  title: string;
  done: boolean;
  period: "morning" | "afternoon" | "evening";
}

const PLACEHOLDER_TASKS: Task[] = [
  { id: 1, title: "Review emails", done: false, period: "morning" },
  { id: 2, title: "Team standup", done: true, period: "morning" },
  { id: 3, title: "Work on feature branch", done: false, period: "afternoon" },
  { id: 4, title: "Code review", done: false, period: "afternoon" },
  { id: 5, title: "Plan tomorrow", done: false, period: "evening" },
  { id: 6, title: "Read for 20 minutes", done: false, period: "evening" },
];

const PERIOD_LABELS: Record<Task["period"], { label: string; icon: string; range: string }> = {
  morning:   { label: "Morning",   icon: "🌤", range: "6 AM – 12 PM" },
  afternoon: { label: "Afternoon", icon: "☀️", range: "12 PM – 5 PM" },
  evening:   { label: "Evening",   icon: "🌙", range: "5 PM – 10 PM" },
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function TodosPage() {
  const [tasks, setTasks] = useState<Task[]>(PLACEHOLDER_TASKS);
  const [mode, setMode] = useState<TimerMode>("focus");
  const [seconds, setSeconds] = useState(POMODORO_MINUTES * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          setRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  function switchMode(next: TimerMode) {
    setMode(next);
    setRunning(false);
    setSeconds((next === "focus" ? POMODORO_MINUTES : SHORT_BREAK_MINUTES) * 60);
  }

  function resetTimer() {
    setRunning(false);
    setSeconds((mode === "focus" ? POMODORO_MINUTES : SHORT_BREAK_MINUTES) * 60);
  }

  function toggleTask(id: number) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  const totalSeconds = (mode === "focus" ? POMODORO_MINUTES : SHORT_BREAK_MINUTES) * 60;
  const progress = ((totalSeconds - seconds) / totalSeconds) * 100;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-12 space-y-12">

        {/* Pomodoro Timer */}
        <section className="flex flex-col items-center gap-6">
          {/* Mode toggle */}
          <div className="flex rounded-full border border-zinc-200 dark:border-zinc-800 p-1 gap-1 text-sm">
            <button
              onClick={() => switchMode("focus")}
              className={`px-4 py-1.5 rounded-full transition-colors font-medium ${
                mode === "focus"
                  ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Focus
            </button>
            <button
              onClick={() => switchMode("break")}
              className={`px-4 py-1.5 rounded-full transition-colors font-medium ${
                mode === "break"
                  ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Short Break
            </button>
          </div>

          {/* Timer ring */}
          <div className="relative flex items-center justify-center">
            <svg width="200" height="200" className="-rotate-90">
              <circle
                cx="100" cy="100" r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-zinc-100 dark:text-zinc-800"
              />
              <circle
                cx="100" cy="100" r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 88}`}
                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                className="text-zinc-900 dark:text-zinc-50 transition-all duration-1000"
              />
            </svg>
            <span className="absolute text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
              {formatTime(seconds)}
            </span>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={resetTimer}
              className="px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setRunning((r) => !r)}
              className="px-8 py-2 rounded-full bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
            >
              {running ? "Pause" : "Start"}
            </button>
          </div>
        </section>

        {/* Tasks by period */}
        <section className="space-y-8">
          {(["morning", "afternoon", "evening"] as Task["period"][]).map((period) => {
            const periodTasks = tasks.filter((t) => t.period === period);
            const { label, icon, range } = PERIOD_LABELS[period];
            const done = periodTasks.filter((t) => t.done).length;

            return (
              <div key={period}>
                <div className="flex items-baseline justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span>{icon}</span>
                    <h2 className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {label}
                    </h2>
                    <span className="text-xs text-zinc-400 dark:text-zinc-600">
                      {range}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400">
                    {done}/{periodTasks.length}
                  </span>
                </div>

                <ul className="space-y-2">
                  {periodTasks.map((task) => (
                    <li
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 cursor-pointer transition-colors select-none"
                    >
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex-shrink-0 transition-colors ${
                          task.done
                            ? "bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50"
                            : "border-zinc-300 dark:border-zinc-600"
                        }`}
                      />
                      <span
                        className={`text-sm transition-colors ${
                          task.done
                            ? "line-through text-zinc-400"
                            : "text-zinc-700 dark:text-zinc-300"
                        }`}
                      >
                        {task.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
