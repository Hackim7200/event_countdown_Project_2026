"use client";

import { useState } from "react";
import { AppHeader } from "@/features/todo/components/app-header";
import { futureEvents, pastEvents } from "../data/mock-events";
import type { EventsTimeframe } from "../types";
import { EventRowCard } from "./event-row-card";
import "@/features/events/styles/events.css";

const copy: Record<
  EventsTimeframe,
  { kicker: string; title: string; description: string }
> = {
  past: {
    kicker: "History log",
    title: "Past Events",
    description:
      "A retrospective of concluded milestones and collaborative sessions within the Obsidian ecosystem.",
  },
  future: {
    kicker: "Planning horizon",
    title: "Future Events",
    description:
      "Scheduled milestones, reviews, and sessions still ahead on the project timeline.",
  },
};

export function EventsPage() {
  const [timeframe, setTimeframe] = useState<EventsTimeframe>("past");
  const events = timeframe === "past" ? pastEvents : futureEvents;
  const c = copy[timeframe];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#F8F9FA]">
      <AppHeader activeNav="events" showHeaderActions />
      <main
        className="tsa-events-canvas flex flex-1 flex-col"
        aria-label="Events"
      >
        <div className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A0A0A0]">
                {c.kicker}
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-[#1A1A1A] capitalize md:text-[44px] md:leading-tight">
                {c.title}
              </h1>
              <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-[#6B7280] md:text-[15px]">
                {c.description}
              </p>
            </div>
            <div
              className="flex gap-8 md:items-center"
              role="tablist"
              aria-label="Event timeframe"
            >
              <button
                type="button"
                role="tab"
                id="tab-past"
                aria-selected={timeframe === "past"}
                aria-controls="events-panel"
                onClick={() => setTimeframe("past")}
                className={`relative pb-1 text-[13px] font-semibold tracking-wide transition-colors duration-200 ${
                  timeframe === "past"
                    ? "text-[#1A1A1A] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-[#1A1A1A]"
                    : "text-[#A0A0A0] hover:text-[#6B7280]"
                }`}
              >
                Past
              </button>
              <button
                type="button"
                role="tab"
                id="tab-future"
                aria-selected={timeframe === "future"}
                aria-controls="events-panel"
                onClick={() => setTimeframe("future")}
                className={`relative pb-1 text-[13px] font-semibold tracking-wide transition-colors duration-200 ${
                  timeframe === "future"
                    ? "text-[#1A1A1A] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-[#1A1A1A]"
                    : "text-[#A0A0A0] hover:text-[#6B7280]"
                }`}
              >
                Future
              </button>
            </div>
          </div>

          <div
            id="events-panel"
            role="tabpanel"
            aria-labelledby={timeframe === "past" ? "tab-past" : "tab-future"}
            className="mt-10 flex flex-col gap-4 md:mt-12 md:gap-5"
          >
            {events.map((event) => (
              <EventRowCard
                key={event.id}
                event={event}
                countdownMode={timeframe === "future" ? "until" : "since"}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
