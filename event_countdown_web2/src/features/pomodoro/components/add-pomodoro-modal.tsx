"use client";

import { useEffect, useState } from "react";

export function AddPomodoroModal({
  open,
  taskTitle,
  onClose,
  onCreate,
}: {
  open: boolean;
  taskTitle: string;
  onClose: () => void;
  onCreate: (input: { title: string; timerDurationInMinutes: number }) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState(25);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setTitle("");
      setMinutes(25);
    }
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    setSaving(true);
    setError(null);
    try {
      await onCreate({
        title: t,
        timerDurationInMinutes: Math.min(120, Math.max(1, minutes)),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create session.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-4 sm:items-center sm:p-6"
      role="presentation"
      onMouseDown={(ev) => {
        if (ev.target === ev.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-pomodoro-title"
        className="w-full max-w-md rounded-xl border border-[#E8EAED] bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.12)]"
      >
        <h2
          id="add-pomodoro-title"
          className="text-lg font-semibold text-[#1A1A1A]"
        >
          Add Pomodoro
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">For: {taskTitle}</p>
        {error ? (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
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
              placeholder="Session name"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#FAFAFB] px-3 py-3 text-[15px] text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#3E475E]"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
              Duration (minutes)
            </span>
            <input
              type="number"
              min={1}
              max={120}
              value={minutes}
              onChange={(e) =>
                setMinutes(Math.min(120, Math.max(1, Number(e.target.value) || 1)))
              }
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-[15px] text-[#1A1A1A] outline-none focus:ring-2 focus:ring-[#3E475E]"
            />
          </label>
          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-semibold text-[#4B5563] hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim() || saving}
              className="rounded-lg bg-[#3E475E] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
            >
              {saving ? "Saving…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
