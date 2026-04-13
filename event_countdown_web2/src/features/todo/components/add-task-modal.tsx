"use client";

import { useEffect, useState } from "react";
import {
  TIME_CATEGORIES,
  type DayTab,
  type TimeCategoryId,
} from "@/src/features/todo/types";

export function AddTaskModal({
  open,
  day,
  presetCategory = "morning",
  onClose,
  onSubmit,
}: {
  open: boolean;
  day: DayTab;
  /** When the sheet opens, time category defaults to this (e.g. Morning vs Afternoon add buttons). */
  presetCategory?: TimeCategoryId;
  onClose: () => void;
  onSubmit: (input: {
    day: DayTab;
    category: TimeCategoryId;
    title: string;
  }) => void | Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TimeCategoryId>(presetCategory);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFormError(null);
    setCategory(presetCategory);
  }, [open, presetCategory]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSaving(true);
    try {
      await onSubmit({
        day,
        category,
        title,
      });
      setTitle("");
      setCategory(presetCategory);
      onClose();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not save this task.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-4 sm:items-center sm:p-6 transition-opacity duration-200"
      role="presentation"
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-task-title"
        className="w-full max-w-md rounded-xl border border-[#E8EAED] bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.12)] transition-transform duration-200"
      >
        <h2
          id="add-task-title"
          className="text-lg font-semibold text-[#1A1A1A]"
        >
          New task
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Added to <span className="font-medium capitalize">{day}</span>.
        </p>
        {formError ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {formError}
          </p>
        ) : null}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
              Title
            </span>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task name"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#FAFAFB] px-3 py-3 text-[15px] text-[#1A1A1A] outline-none ring-[#1A1A1A] transition-shadow focus:border-[#D1D5DB] focus:ring-2 focus:ring-offset-0"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
              Time category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TimeCategoryId)}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-[15px] text-[#1A1A1A] outline-none ring-[#1A1A1A] transition-shadow focus:border-[#D1D5DB] focus:ring-2"
            >
              {TIME_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label} ({c.range})
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#4B5563] transition-colors hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || saving}
              className="rounded-lg bg-[#4A5568] px-4 py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-40"
            >
              {saving ? "Saving…" : "Add task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
