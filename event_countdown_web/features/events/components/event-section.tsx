import type { DummyEvent } from "../data/events-dummy";
import { EventCard } from "./event-card";

type EventSectionProps = {
  heading: string;
  description: string;
  events: DummyEvent[];
};

export function EventSection({
  heading,
  description,
  events,
}: EventSectionProps) {
  return (
    <section className="mb-14 last:mb-0">
      <div className="mb-6">
        <h2 className="text-lg font-semibold tracking-tight text-zinc-900">
          {heading}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white px-5">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
