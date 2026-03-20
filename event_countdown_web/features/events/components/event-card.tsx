import type { DummyEvent } from "../data/events-dummy";

type EventCardProps = {
  event: DummyEvent;
};

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="border-b border-zinc-200 py-5 last:border-b-0">
      <h3 className="text-[15px] font-medium text-zinc-900">{event.title}</h3>
      <p className="mt-2 text-sm text-zinc-600">{event.dateLabel}</p>
      <p className="mt-1 text-xs uppercase tracking-wider text-zinc-400">
        {event.location}
      </p>
    </article>
  );
}
