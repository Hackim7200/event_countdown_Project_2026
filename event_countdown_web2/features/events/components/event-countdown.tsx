"use client";

import { useEffect, useState } from "react";

const MS_DAY = 86400000;
const MS_HOUR = 3600000;

function eventInstant(isoDate: string): number {
  return new Date(`${isoDate}T12:00:00`).getTime();
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addCalendarMonths(d: Date, months: number): Date {
  return new Date(
    d.getFullYear(),
    d.getMonth() + months,
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds(),
  );
}

/** Whole calendar months from `from` (inclusive) plus remaining full days until `to`. */
function monthsAndDaysBetween(
  from: Date,
  to: Date,
): { months: number; days: number } {
  if (to.getTime() <= from.getTime()) {
    return { months: 0, days: 0 };
  }

  let months = 0;
  let cur = new Date(from.getTime());

  for (;;) {
    const next = addCalendarMonths(cur, 1);
    if (next.getTime() > to.getTime()) break;
    cur = next;
    months++;
    if (months > 10_000) break;
  }

  const days = Math.floor((to.getTime() - cur.getTime()) / MS_DAY);
  return { months, days: Math.max(0, days) };
}

/**
 * Calendar-based span: drop the finest unit when a coarser tier is “above 1”.
 * - More than 1 year (>12 full months): years + months only.
 * - Exactly 12 months: 1y + days only (not more than 1 year).
 * - More than 1 month (2–11): months only.
 * - 1 month: 1mo + days only if days > 0.
 */
function formatCalendarSpan(months: number, days: number): string {
  if (months > 12) {
    const years = Math.floor(months / 12);
    const remMo = months % 12;
    const parts: string[] = [`${years}y`];
    if (remMo > 0) parts.push(`${remMo}mo`);
    return parts.join(" ");
  }

  if (months === 12) {
    const parts: string[] = ["1y"];
    if (days > 0) parts.push(`${days}d`);
    return parts.join(" ");
  }

  if (months >= 2) {
    return `${months}mo`;
  }

  if (months === 1) {
    return days > 0 ? `1mo ${days}d` : "1mo";
  }

  return days > 0 ? `${days}d` : "0d";
}

/** More than 1 day → days only; else hours (see formatHoursOnly). */
function formatDaysOnly(ms: number): string {
  const d = Math.floor(ms / MS_DAY);
  return d > 1 ? `${d}d` : "1d";
}

/** More than 1 hour → hours only; 1 hour → 1h; under 1h → "<1h". */
function formatHoursOnly(ms: number): string {
  const h = Math.floor(ms / MS_HOUR);
  if (h > 1) return `${h}h`;
  if (h === 1) return "1h";
  return "<1h";
}

/** Calendar months first; else ≥24h → days-only tier; else hours-only tier. */
function formatUntil(targetMs: number, now: number): string {
  const remaining = targetMs - now;
  if (remaining <= 0) return "Now";

  const today = startOfLocalDay(new Date(now));
  const eventDay = startOfLocalDay(new Date(targetMs));
  const { months, days } = monthsAndDaysBetween(today, eventDay);

  if (months >= 1) {
    return formatCalendarSpan(months, days);
  }
  if (remaining >= MS_DAY) {
    return formatDaysOnly(remaining);
  }
  return formatHoursOnly(remaining);
}

/** Calendar months first; else ≥24h → days-only tier; else hours-only tier. */
function formatSince(targetMs: number, now: number): string {
  const elapsed = now - targetMs;
  if (elapsed < 0) return "—";

  const eventDay = startOfLocalDay(new Date(targetMs));
  const today = startOfLocalDay(new Date(now));
  const { months, days } = monthsAndDaysBetween(eventDay, today);

  if (months >= 1) {
    return formatCalendarSpan(months, days);
  }
  if (elapsed >= MS_DAY) {
    return formatDaysOnly(elapsed);
  }
  return formatHoursOnly(elapsed);
}

export function EventCountdown({
  isoDate,
  mode,
  alignEnd = false,
}: {
  isoDate: string;
  mode: "until" | "since";
  alignEnd?: boolean;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const targetMs = eventInstant(isoDate);
  const value =
    mode === "until" ? formatUntil(targetMs, now) : formatSince(targetMs, now);

  const label = mode === "until" ? "Time remaining" : "Time elapsed";

  return (
    <div className={`${alignEnd ? "text-right" : ""}`} aria-live="polite">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A0A0A0]">
        {label}
      </p>
      <p className="mt-1 whitespace-nowrap text-[13px] font-bold tabular-nums tracking-tight text-[#1A1A1A] min-[400px]:text-[15px] md:text-base">
        {value}
      </p>
    </div>
  );
}
