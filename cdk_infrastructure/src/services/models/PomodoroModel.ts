export interface PomodoroEntry {
  id: string;
  userId: string; // required for single-table PK
  todoId: string;
  title: string;
  // completed: boolean;
  timerDurationInMinutes: number;
  startedAt?: string; // ISO 8601 timestamp set when timer begins
  elapsedSeconds: number; // accumulated seconds from previous start/stop cycles
  status: string; // running, stopped, completed
}
