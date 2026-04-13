import type { TimeCategoryId } from "@/src/features/todo/types";

/** Labels sent to the same REST API as Flutter `AddTaskBottomSheet`. */
const CATEGORY_TO_API: Record<TimeCategoryId, string> = {
  morning: "Morning",
  earlyAfternoon: "Early Afternoon",
  lateAfternoon: "Late Afternoon",
  twilight: "Twilight",
  night: "Night",
};

export function timeCategoryToApiPeriod(category: TimeCategoryId): string {
  return CATEGORY_TO_API[category];
}

export function apiPeriodToTimeCategory(period: string): TimeCategoryId {
  const n = period.trim().toLowerCase();
  if (n === "morning") return "morning";
  if (n === "early afternoon") return "earlyAfternoon";
  if (n === "late afternoon") return "lateAfternoon";
  if (n === "twilight") return "twilight";
  if (n === "night") return "night";
  return "morning";
}
