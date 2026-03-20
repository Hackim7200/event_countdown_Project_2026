import { EventSection } from "../components/event-section";
import { futureEvents, pastEvents } from "../data/events-dummy";

export function EventScreen() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold tracking-tight text-zinc-950">
        Events
      </h1>
      <p className="mb-12 max-w-md text-sm leading-relaxed text-zinc-500">
        Past events and what is coming up next.
      </p>
      <EventSection
        heading="Past"
        description="Recently completed or archived on the timeline."
        events={pastEvents}
      />
      <EventSection
        heading="Upcoming"
        description="Scheduled ahead on your calendar."
        events={futureEvents}
      />
    </div>
  );
}
