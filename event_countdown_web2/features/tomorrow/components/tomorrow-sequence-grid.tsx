"use client";

import { SequenceGrid } from "@/features/today/components/sequence-grid";
import type { Task } from "@/features/todo/types";

/** Tomorrow tab uses the same grid layout and cards as Today; only the dataset differs. */
export function TomorrowSequenceGrid(props: { tasks: Task[] }) {
  return <SequenceGrid day="tomorrow" tasks={props.tasks} />;
}
