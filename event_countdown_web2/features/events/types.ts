export type EventIconKind =
  | "easel"
  | "clipboard"
  | "upload"
  | "calendar"
  | "users"
  | "blueprint"
  | "archive"
  | "clock"
  | "map"
  | "phone";

export type EventsTimeframe = "past" | "future";

export type EventListItem = {
  id: string;
  title: string;
  description: string;
  /** ISO date string (calendar day) */
  date: string;
  icon: EventIconKind;
};
