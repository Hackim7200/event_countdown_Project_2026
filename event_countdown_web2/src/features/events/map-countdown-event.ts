import type { CountdownEventDto } from "@/src/app/services/EventService";
import type { EventIconKind, EventListItem } from "@/src/features/events/types";

const KINDS: EventIconKind[] = [
  "calendar",
  "easel",
  "clock",
  "clipboard",
  "blueprint",
  "users",
  "upload",
  "archive",
  "map",
  "phone",
];

export function iconIndexToEventKind(icon: number | undefined): EventIconKind {
  const i = typeof icon === "number" && !Number.isNaN(icon) ? icon : 0;
  const n = KINDS.length;
  return KINDS[((i % n) + n) % n];
}

function calendarDateFromDueDate(due: string): string {
  const d = new Date(due);
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }
  const head = due.split("T")[0];
  return head && head.length >= 10 ? head : due;
}

export function countdownEventToListItem(dto: CountdownEventDto): EventListItem {
  const desc = (dto.description ?? "").trim();
  return {
    id: dto.id,
    title: dto.title,
    description: desc.length > 0 ? desc : "—",
    date: calendarDateFromDueDate(dto.dueDate),
    icon: iconIndexToEventKind(dto.icon),
  };
}
