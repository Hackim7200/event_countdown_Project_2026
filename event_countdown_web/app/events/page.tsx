import { AppShell } from "@/features/shared/components/app-shell";
import { EventScreen } from "@/features/events/screens/event-screen";

export default function EventsPage() {
  return (
    <AppShell>
      <EventScreen />
    </AppShell>
  );
}
