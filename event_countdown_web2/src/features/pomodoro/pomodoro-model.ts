/** Dynamo item shape from GET /pomodoros (unmarshalled). */
export type PomodoroRecord = {
  id: string;
  title: string;
  status: string;
  timerDurationInMinutes?: number;
  elapsedSeconds?: number;
  startedAt?: string | null;
};

export function pomodoroTotalSeconds(p: PomodoroRecord): number {
  const mins = p.timerDurationInMinutes ?? 25;
  return Math.max(0, mins * 60);
}

/** Remaining focus time in seconds (matches Flutter `Pomodoro.remaining`). */
export function pomodoroRemainingSeconds(
  p: PomodoroRecord,
  nowMs = Date.now(),
): number {
  if (p.status === "completed") return 0;
  const total = pomodoroTotalSeconds(p);
  let elapsed = p.elapsedSeconds ?? 0;
  if (p.startedAt && p.status === "running") {
    const started = new Date(p.startedAt).getTime();
    if (!Number.isNaN(started)) {
      elapsed += Math.floor((nowMs - started) / 1000);
    }
  }
  return Math.max(0, total - elapsed);
}

export function isPomodoroRunning(p: PomodoroRecord): boolean {
  return p.status === "running";
}

export function isPomodoroCompleted(p: PomodoroRecord): boolean {
  return p.status === "completed";
}

export function formatMmSs(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}
