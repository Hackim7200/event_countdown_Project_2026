import type { EventListItem } from "../types";
import { EventCountdown } from "./event-countdown";
import { EventListIcon } from "./event-list-icon";

export function EventRowCard({
  event,
  countdownMode,
}: {
  event: EventListItem;
  countdownMode: "until" | "since";
}) {
  return (
    <article
      className="group flex items-center justify-between gap-4 rounded-lg bg-white px-5 py-4 shadow-[0_1px_3px_rgba(15,23,42,0.07)] transition-all duration-200 hover:shadow-[0_4px_16px_rgba(15,23,42,0.1)] active:scale-[0.995] md:gap-6 md:px-6 md:py-[18px]"
      aria-labelledby={`event-title-${event.id}`}
    >
      <time dateTime={event.date} className="sr-only">
        {event.date}
      </time>

      <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-5">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#E8EEF3] transition-colors duration-200 group-hover:bg-[#DFE6EE] md:h-[52px] md:w-[52px] md:rounded-[10px]"
          aria-hidden
        >
          <EventListIcon
            kind={event.icon}
            className="h-5 w-5 text-[#4B5563] md:h-[22px] md:w-[22px]"
          />
        </div>
        <div className="min-w-0 py-0.5">
          <h2
            id={`event-title-${event.id}`}
            className="text-[15px] font-bold leading-snug tracking-tight text-[#1A1A1A] md:text-base"
          >
            {event.title}
          </h2>
          <p className="mt-1 text-[13px] font-normal leading-relaxed text-[#6B7280] md:text-[14px]">
            {event.description}
          </p>
        </div>
      </div>

      <div className="shrink-0 pl-2 text-right">
        <EventCountdown isoDate={event.date} mode={countdownMode} alignEnd />
      </div>
    </article>
  );
}
