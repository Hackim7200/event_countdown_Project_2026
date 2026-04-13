"use client";

import { useEffect, useState } from "react";
import { createCountdownEvent } from "@/src/app/services/EventService";

export function AddEventModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueLocal, setDueLocal] = useState("");
  const [iconIndex, setIconIndex] = useState(0);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFormError(null);
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setDueLocal(d.toISOString().slice(0, 16));
  }, [open]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    const trimmed = title.trim();
    if (!trimmed) return;

    const due = new Date(dueLocal);
    if (Number.isNaN(due.getTime())) {
      setFormError("Pick a valid date and time.");
      return;
    }

    setSaving(true);
    try {
      const id = await createCountdownEvent({
        title: trimmed,
        dueDate: due,
        description: description.trim(),
        icon: iconIndex,
      });
      if (!id) {
        setFormError("Server did not return a new event id.");
        return;
      }
      setTitle("");
      setDescription("");
      setIconIndex(0);
      onCreated();
      onClose();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not create this event.",
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
        aria-labelledby="add-event-title"
        className="w-full max-w-md rounded-xl border border-[#E8EAED] bg-white p-6 shadow-[0_16px_48px_rgba(15,23,42,0.12)] transition-transform duration-200"
      >
        <h2
          id="add-event-title"
          className="text-lg font-semibold text-[#1A1A1A]"
        >
          New event
        </h2>
        <p className="mt-1 text-sm text-[#6B7280]">
          Same fields as the mobile app (title, date, description, icon index).
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
              placeholder="Event name"
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#FAFAFB] px-3 py-3 text-[15px] text-[#1A1A1A] outline-none ring-[#1A1A1A] transition-shadow focus:border-[#D1D5DB] focus:ring-2 focus:ring-offset-0"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
              Due date
            </span>
            <input
              type="datetime-local"
              value={dueLocal}
              onChange={(e) => setDueLocal(e.target.value)}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-3 text-[15px] text-[#1A1A1A] outline-none ring-[#1A1A1A] transition-shadow focus:border-[#D1D5DB] focus:ring-2"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional"
              className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-[#FAFAFB] px-3 py-3 text-[15px] text-[#1A1A1A] outline-none ring-[#1A1A1A] transition-shadow focus:border-[#D1D5DB] focus:ring-2 focus:ring-offset-0"
            />
          </label>
          <label className="block space-y-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#9CA3AF]">
              Icon index (0–39, matches mobile picker order)
            </span>
            <input
              type="number"
              min={0}
              max={39}
              value={iconIndex}
              onChange={(e) =>
                setIconIndex(
                  Math.min(39, Math.max(0, Number(e.target.value) || 0)),
                )
              }
              className="w-full rounded-lg border border-[#E5E7EB] bg-[#FAFAFB] px-3 py-3 text-[15px] text-[#1A1A1A] outline-none ring-[#1A1A1A] transition-shadow focus:border-[#D1D5DB] focus:ring-2 focus:ring-offset-0"
            />
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
              {saving ? "Saving…" : "Create event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
