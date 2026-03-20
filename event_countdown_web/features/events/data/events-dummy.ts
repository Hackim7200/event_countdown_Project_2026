export type DummyEvent = {
  id: string;
  title: string;
  dateLabel: string;
  location: string;
};

export const pastEvents: DummyEvent[] = [
  {
    id: "e1",
    title: "Quarterly planning offsite",
    dateLabel: "Jan 14 — Jan 16, 2025",
    location: "Lisbon",
  },
  {
    id: "e2",
    title: "Design critique: onboarding",
    dateLabel: "Feb 4, 2025 · 10:00",
    location: "Remote",
  },
  {
    id: "e3",
    title: "Team dinner",
    dateLabel: "Feb 28, 2025 · 19:30",
    location: "North Quarter",
  },
];

export const futureEvents: DummyEvent[] = [
  {
    id: "e4",
    title: "Product launch dry run",
    dateLabel: "Mar 24, 2025 · 15:00",
    location: "Studio A",
  },
  {
    id: "e5",
    title: "All-hands",
    dateLabel: "Apr 2, 2025 · 09:00",
    location: "Livestream",
  },
  {
    id: "e6",
    title: "Spring user research block",
    dateLabel: "Apr 22 — Apr 25, 2025",
    location: "Berlin",
  },
];
