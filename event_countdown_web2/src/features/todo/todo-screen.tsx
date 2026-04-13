"use client";

import { useState } from "react";
import { AppHeader } from "@/src/features/todo/components/app-header";
import { AddTaskModal } from "@/src/features/todo/components/add-task-modal";
import { useTodo } from "@/src/features/todo/context/todo-context";
import type { DayTab, TimeCategoryId } from "@/src/features/todo/types";
import { SequenceGrid } from "@/src/features/today/components/sequence-grid";
import { TomorrowSequenceGrid } from "@/src/features/tomorrow/components/tomorrow-sequence-grid";
import "@/src/features/todo/styles/todo.css";

export function TodoScreen() {
  const { tasks, addTask, isLoading, error, refreshTasks } = useTodo();
  const [tab, setTab] = useState<DayTab>("today");
  const [addOpen, setAddOpen] = useState(false);
  const [addPresetCategory, setAddPresetCategory] =
    useState<TimeCategoryId>("morning");

  function openAddTask(category: TimeCategoryId) {
    setAddPresetCategory(category);
    setAddOpen(true);
  }

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

          {error ? (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void refreshTasks()}
                className="mt-2 text-sm font-semibold text-amber-900 underline"
              >
                Try again
              </button>
            </div>
          ) : null}

          <div className="tsa-tab-panel mt-10 md:mt-12">
            {isLoading ? (
              <p className="text-[15px] text-[#6B7280]">Loading tasks…</p>
            ) : tab === "today" ? (
              <SequenceGrid
                day="today"
                tasks={tasks}
                onAddTask={openAddTask}
              />
            ) : (
              <TomorrowSequenceGrid
                tasks={tasks}
                onAddTask={openAddTask}
              />
            )}
          </div>
        </div>
      </main>

      <AddTaskModal
        open={addOpen}
        day={tab}
        presetCategory={addPresetCategory}
        onClose={() => setAddOpen(false)}
        onSubmit={addTask}
      />
    </div>
  );
}
