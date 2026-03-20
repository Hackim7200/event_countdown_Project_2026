"use client";

import Navbar from "@/components/shared/Navbar";
import { useState } from "react";

type Tab = "upcoming" | "past";

interface Event {
  id: number;
  title: string;
  date: Date;
  emoji: string;
}

const PLACEHOLDER_EVENTS: Event[] = [
  { id: 1, title: "Summer Holiday",      date: new Date("2026-07-15"), emoji: "🏖" },
  { id: 2, title: "Product Launch",      date: new Date("2026-04-10"), emoji: "🚀" },
  { id: 3, title: "Friend's Wedding",    date: new Date("2026-09-20"), emoji: "💍" },
  { id: 4, title: "Conference Talk",     date: new Date("2026-05-03"), emoji: "🎤" },
  { id: 5, title: "New Year's Eve",      date: new Date("2025-12-31"), emoji: "🎆" },
  { id: 6, title: "Project Kickoff",     date: new Date("2026-01-15"), emoji: "📋" },
  { id: 7, title: "Birthday Party",      date: new Date("2025-11-08"), emoji: "🎂" },
];

function naturalCountdown(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const isPast = diffMs < 0;
  const abs = Math.abs(diffMs);

  const totalDays = Math.floor(abs / (1000 * 60 * 60 * 24));
  const years  = Math.floor(totalDays / 365);
  const months = Math.floor((totalDays % 365) / 30);
  const days   = totalDays % 30;

  const parts: string[] = [];
  if (years  > 0) parts.push(`${years} year${years  > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`);
  if (days   > 0) parts.push(`${days} day${days   > 1 ? "s" : ""}`);

  if (parts.length === 0) return isPast ? "Just now" : "Today";

  const joined = parts.slice(0, 2).join(", ");
  return isPast ? `${joined} ago` : `in ${joined}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function EventsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const now = new Date();

  const upcoming = PLACEHOLDER_EVENTS
    .filter((e) => e.date >= now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const past = PLACEHOLDER_EVENTS
    .filter((e) => e.date < now)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const displayed = tab === "upcoming" ? upcoming : past;

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-2xl px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Events
          </h1>
          {/* Tabs */}
          <div className="flex rounded-full border border-zinc-200 dark:border-zinc-800 p-1 gap-1 text-sm">
            <button
              onClick={() => setTab("upcoming")}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
                tab === "upcoming"
                  ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Upcoming
              <span className="ml-1.5 text-xs opacity-60">{upcoming.length}</span>
            </button>
            <button
              onClick={() => setTab("past")}
              className={`px-4 py-1.5 rounded-full font-medium transition-colors ${
                tab === "past"
                  ? "bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900"
                  : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
              }`}
            >
              Past
              <span className="ml-1.5 text-xs opacity-60">{past.length}</span>
            </button>
          </div>
        </div>

        {/* Event list */}
        {displayed.length === 0 ? (
          <p className="text-center text-zinc-400 dark:text-zinc-600 py-20 text-sm">
            No {tab} events
          </p>
        ) : (
          <ul className="space-y-3">
            {displayed.map((event) => (
              <li
                key={event.id}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
              >
                <span className="text-2xl">{event.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
                    {event.title}
                  </p>
                  <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-0.5">
                    {formatDate(event.date)}
                  </p>
                </div>
                <span
                  className={`text-sm font-medium flex-shrink-0 ${
                    tab === "upcoming"
                      ? "text-zinc-900 dark:text-zinc-50"
                      : "text-zinc-400 dark:text-zinc-600"
                  }`}
                >
                  {naturalCountdown(event.date)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
