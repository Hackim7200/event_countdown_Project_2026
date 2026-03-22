"use client";

import { useState } from "react";
import { AppHeader } from "@/features/todo/components/app-header";
import { AddTaskModal } from "@/features/todo/components/add-task-modal";
import { useTodo } from "@/features/todo/context/todo-context";
import type { DayTab } from "@/features/todo/types";
import { SequenceGrid } from "@/features/today/components/sequence-grid";
import { TomorrowSequenceGrid } from "@/features/tomorrow/components/tomorrow-sequence-grid";
import "@/features/todo/styles/todo.css";

export function TodoPage() {
  const { tasks, addTask } = useTodo();
  const [tab, setTab] = useState<DayTab>("today");
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#F8F9FA]">
      <AppHeader activeNav="todos" />
      <main className="relative flex-1 pb-28">
        <div className="mx-auto max-w-[1200px] px-4 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 transition-opacity duration-200">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                Current Sequence
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#1A1A1A] md:text-[44px] md:leading-tight capitalize">
                {tab}
              </h1>
            </div>
            <div className="flex gap-8 md:items-center">
              <button
                type="button"
                onClick={() => setTab("today")}
                className={`relative pb-1 text-[13px] font-semibold tracking-wide transition-colors duration-200 ${
                  tab === "today"
                    ? "text-[#1A1A1A] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-[#1A1A1A]"
                    : "text-[#A0A0A0] hover:text-[#6B7280]"
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setTab("tomorrow")}
                className={`relative pb-1 text-[13px] font-semibold tracking-wide transition-colors duration-200 ${
                  tab === "tomorrow"
                    ? "text-[#1A1A1A] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-[#1A1A1A]"
                    : "text-[#A0A0A0] hover:text-[#6B7280]"
                }`}
              >
                Tomorrow
              </button>
            </div>
          </div>

          <div className="tsa-tab-panel mt-10 md:mt-12">
            {tab === "today" ? (
              <SequenceGrid day="today" tasks={tasks} />
            ) : (
              <TomorrowSequenceGrid tasks={tasks} />
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="fixed bottom-6 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-lg bg-[#4A5568] text-white shadow-[0_8px_24px_rgba(15,23,42,0.18)] transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98] md:bottom-8 md:right-8 md:h-[56px] md:w-[56px]"
          aria-label="Add task"
        >
          <PlusIcon className="h-7 w-7" />
        </button>
      </main>

      <AddTaskModal
        open={addOpen}
        day={tab}
        onClose={() => setAddOpen(false)}
        onSubmit={addTask}
      />
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
