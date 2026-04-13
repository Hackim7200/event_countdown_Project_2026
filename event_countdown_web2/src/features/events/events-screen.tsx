"use client";

import { useCallback, useEffect, useState } from "react";
import {
  deleteCountdownEvent,
  fetchCountdownEvents,
} from "@/src/app/services/EventService";
import { AddEventModal } from "@/src/features/events/components/add-event-modal";
import { EventRowCard } from "@/src/features/events/components/event-row-card";
import { countdownEventToListItem } from "@/src/features/events/map-countdown-event";
import type { EventListItem, EventsTimeframe } from "@/src/features/events/types";
import { AppHeader } from "@/src/features/todo/components/app-header";
import { DashedAddTile } from "@/src/shared/components/dashed-add-tile";
import "@/src/features/events/styles/events.css";

const copy: Record<
  EventsTimeframe,
  { kicker: string; title: string; description: string }
> = {
  past: {
    kicker: "History log",
    title: "Past Events",
    description:
      "Concluded milestones loaded from the same Countdown API as the mobile app.",
  },
  future: {
    kicker: "Planning horizon",
    title: "Future Events",
    description:
      "Upcoming dates from your account, kept in sync with Event Countdown on iOS and Android.",
  },
};

export function EventsScreen() {
  const [timeframe, setTimeframe] = useState<EventsTimeframe>("past");
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);

  const load = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const fp = timeframe === "past" ? "past" : "future";
      const rows = await fetchCountdownEvents(fp);
      setEvents(rows.map(countdownEventToListItem));
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Could not load events from the server.",
      );
      setEvents([]);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  useEffect(() => {
    void load();
  }, [load]);

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
              className="flex flex-wrap items-center gap-6 md:items-center"
              role="tablist"
              aria-label="Event timeframe"
            >
              <div className="flex gap-8">
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
          </div>

          {error ? (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p>{error}</p>
              <button
                type="button"
                onClick={() => void load()}
                className="mt-2 text-sm font-semibold text-amber-900 underline"
              >
                Try again
              </button>
            </div>
          ) : null}

          <div
            id="events-panel"
            role="tabpanel"
            aria-labelledby={timeframe === "past" ? "tab-past" : "tab-future"}
            className="mt-10 flex flex-col gap-4 md:mt-12 md:gap-5"
          >
            {loading ? (
              <p className="text-[15px] text-[#6B7280]">Loading events…</p>
            ) : events.length === 0 ? (
              <p className="text-[15px] text-[#6B7280]">
                No events in this tab yet.
              </p>
            ) : (
              events.map((event) => (
                <EventRowCard
                  key={event.id}
                  event={event}
                  countdownMode={timeframe === "future" ? "until" : "since"}
                  onDelete={() => {
                    void (async () => {
                      const ok = await deleteCountdownEvent(event.id);
                      if (ok) void load();
                    })();
                  }}
                />
              ))
            )}
            {!loading ? (
              <DashedAddTile
                variant="eventRow"
                onClick={() => setAddOpen(true)}
                className="mt-2"
                ariaLabel="Add new event"
              />
            ) : null}
          </div>
        </div>
      </main>

      <AddEventModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={() => void load()}
      />
    </div>
  );
}
