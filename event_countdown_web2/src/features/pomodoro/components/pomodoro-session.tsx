"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  completePomodoro,
  createPomodoro,
  deletePomodoro,
  fetchPomodorosForTodo,
  pausePomodoro,
  resetPomodoro,
  startPomodoro,
} from "@/src/app/services/PomodoroService";
import { CountdownWebSocket } from "@/src/features/pomodoro/countdown-websocket";
import {
  formatMmSs,
  isPomodoroCompleted,
  isPomodoroRunning,
  pomodoroRemainingSeconds,
  pomodoroTotalSeconds,
  type PomodoroRecord,
} from "@/src/features/pomodoro/pomodoro-model";
import { AddPomodoroModal } from "@/src/features/pomodoro/components/add-pomodoro-modal";
import { DashedAddTile } from "@/src/shared/components/dashed-add-tile";
import "@/src/features/pomodoro/styles/pomodoro.css";

export function PomodoroSession({
  todoId,
  taskTitle,
}: {
  todoId: string;
  taskTitle: string;
}) {
  const [pomodoros, setPomodoros] = useState<PomodoroRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const completingRef = useRef<Set<string>>(new Set());
  const pomodorosRef = useRef(pomodoros);
  pomodorosRef.current = pomodoros;
  const selectedIdRef = useRef<string | null>(null);
  selectedIdRef.current = selectedId;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 4000);
  }, []);

  const autoSelect = useCallback((list: PomodoroRecord[]) => {
    setSelectedId((cur) => {
      if (cur && list.some((p) => p.id === cur)) return cur;
      const running = list.find((p) => isPomodoroRunning(p));
      if (running) return running.id;
      const open = list.find((p) => !isPomodoroCompleted(p));
      return open?.id ?? list[0]?.id ?? null;
    });
  }, []);

  const loadPomodoros = useCallback(
    async (silent: boolean) => {
      if (!todoId) return;
      if (!silent) {
        setLoading(true);
        setError(null);
      }
      try {
        const list = await fetchPomodorosForTodo(todoId);
        setPomodoros(list);
        autoSelect(list);
      } catch (e) {
        if (!silent) {
          setError(e instanceof Error ? e.message : "Failed to load sessions.");
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [todoId, autoSelect],
  );

  useEffect(() => {
    void loadPomodoros(false);
  }, [loadPomodoros]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTick((t) => t + 1);
      void (async () => {
        const list = pomodorosRef.current;
        for (const p of list) {
          if (!isPomodoroRunning(p) || !p.startedAt) continue;
          if (pomodoroRemainingSeconds(p) > 0) continue;
          if (completingRef.current.has(p.id)) continue;
          completingRef.current.add(p.id);
          await completePomodoro({ pomodoroId: p.id, todoId });
          await loadPomodoros(true);
          completingRef.current.delete(p.id);
        }
      })();
    }, 1000);
    return () => clearInterval(id);
  }, [todoId, loadPomodoros]);

  useEffect(() => {
    const ws = new CountdownWebSocket();
    void ws.connect();
    const unsub = ws.subscribe((e) => {
      if (e.type !== "pomodoro_update") return;
      const tid = e.data.todoId;
      if (typeof tid === "string" && tid !== todoId) return;

      const pomodoroId =
        typeof e.data.pomodoroId === "string" ? e.data.pomodoroId : undefined;

      if (e.action === "started") {
        void (async () => {
          if (!pomodoroId || pomodoroId === selectedIdRef.current) {
            await loadPomodoros(true);
            return;
          }
          await loadPomodoros(true);
          setSelectedId(pomodoroId);
          const title =
            pomodorosRef.current.find((p) => p.id === pomodoroId)?.title ??
            "another session";
          showToast(`Timer switched to: ${title}`);
        })();
        return;
      }
      if (e.action === "completed") {
        void (async () => {
          await loadPomodoros(true);
          if (pomodoroId === selectedIdRef.current) {
            showToast("Timer completed!");
          }
        })();
        return;
      }
      void loadPomodoros(true);
    });
    return () => {
      unsub();
      ws.dispose();
    };
  }, [todoId, loadPomodoros, showToast]);

  const selected = useMemo(
    () => pomodoros.find((p) => p.id === selectedId) ?? null,
    [pomodoros, selectedId],
  );

  const timerUi = useMemo(() => {
    if (!selected) {
      return {
        display: "25:00",
        status: "Ready",
        progress: 0,
        running: false,
      };
    }
    if (isPomodoroCompleted(selected)) {
      return {
        display: "00:00",
        status: "Completed",
        progress: 1,
        running: false,
      };
    }
    const rem = pomodoroRemainingSeconds(selected);
    const total = pomodoroTotalSeconds(selected);
    const progress =
      total > 0 ? Math.min(1, Math.max(0, 1 - rem / total)) : 0;
    let status = "Ready";
    if (isPomodoroRunning(selected)) status = "Focusing…";
    else if ((selected.elapsedSeconds ?? 0) > 0) status = "Paused";
    return {
      display: formatMmSs(rem),
      status,
      progress,
      running: isPomodoroRunning(selected),
    };
  }, [selected, tick]);

  const completedCount = pomodoros.filter((p) => isPomodoroCompleted(p)).length;

  async function toggleSelected() {
    if (!selected || !todoId) return;
    if (isPomodoroCompleted(selected)) return;
    if (isPomodoroRunning(selected)) {
      await pausePomodoro({ pomodoroId: selected.id, todoId });
    } else {
      const started = await startPomodoro({ pomodoroId: selected.id, todoId });
      if (started === null) {
        await loadPomodoros(true);
        showToast("Another pomodoro is already running for this task.");
        return;
      }
    }
    await loadPomodoros(true);
  }

  async function resetSelected() {
    if (!selected || !todoId || isPomodoroCompleted(selected)) return;
    await resetPomodoro({ pomodoroId: selected.id, todoId });
    await loadPomodoros(true);
  }

  async function onTileTapped(p: PomodoroRecord) {
    if (!todoId) return;
    if (p.id === selectedId) {
      await toggleSelected();
      return;
    }
    const prev = selected;
    if (prev && isPomodoroRunning(prev) && !isPomodoroCompleted(prev)) {
      await resetPomodoro({ pomodoroId: prev.id, todoId });
    }
    setSelectedId(p.id);
    if (!isPomodoroCompleted(p)) {
      const started = await startPomodoro({ pomodoroId: p.id, todoId });
      if (started === null) {
        await loadPomodoros(true);
        showToast("Another pomodoro is already running for this task.");
        return;
      }
    }
    await loadPomodoros(true);
  }

  async function onRowReset(p: PomodoroRecord, ev: React.MouseEvent) {
    ev.stopPropagation();
    if (!todoId) return;
    await resetPomodoro({ pomodoroId: p.id, todoId });
    await loadPomodoros(true);
  }

  async function onRowComplete(p: PomodoroRecord, ev: React.MouseEvent) {
    ev.stopPropagation();
    if (!todoId) return;
    await completePomodoro({ pomodoroId: p.id, todoId });
    await loadPomodoros(true);
  }

  async function onRowDelete(p: PomodoroRecord, ev: React.MouseEvent) {
    ev.stopPropagation();
    if (!todoId) return;
    if (!window.confirm("Delete this Pomodoro session?")) return;
    const ok = await deletePomodoro({ pomodoroId: p.id, todoId });
    if (ok) await loadPomodoros(true);
  }

  return (
    <div className="mx-auto w-full max-w-[800px] px-4 py-10 md:px-6 md:py-14">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/todo/"
          className="text-sm font-semibold text-[#4B5563] hover:text-[#1A1A1A]"
        >
          ← Todos
        </Link>
      </div>

      {toast ? (
        <div className="mb-4 rounded-lg bg-[#EEF2FF] px-4 py-3 text-sm font-medium text-[#3730A3]">
          {toast}
        </div>
      ) : null}

      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9CA3AF]">
        Focus session
      </p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#1A1A1A] md:text-3xl">
        {taskTitle}
      </h1>

      {loading ? (
        <p className="mt-12 text-center text-[#6B7280]">Loading sessions…</p>
      ) : error ? (
        <div className="mt-12 text-center">
          <p className="text-[#374151]">{error}</p>
          <button
            type="button"
            onClick={() => void loadPomodoros(false)}
            className="mt-4 rounded-full bg-[#3E475E] px-6 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <section className="tsa-pomodoro-stack mt-10 flex flex-col items-center text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9CA3AF]">
              Currently focusing
            </p>
            <p
              className="mt-4 text-[clamp(3rem,10vw,4.5rem)] font-bold leading-none tracking-tight text-[#3E475E]"
              aria-live="polite"
            >
              {timerUi.display}
            </p>
            <p className="mt-2 text-sm font-medium text-[#6B7280]">
              {timerUi.status}
            </p>
            <div className="mt-4 h-2 w-[min(100%,320px)] overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#3E475E] transition-[width] duration-300"
                style={{ width: `${String(timerUi.progress * 100)}%` }}
              />
            </div>
            <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => void toggleSelected()}
                disabled={!selected || isPomodoroCompleted(selected)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#3E475E] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#323a4f] disabled:opacity-40 sm:flex-none sm:min-w-[180px]"
              >
                {timerUi.running ? "Pause" : "Start"}
              </button>
              <button
                type="button"
                onClick={() => void resetSelected()}
                disabled={!selected || isPomodoroCompleted(selected)}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-[#D1DCE5] px-6 py-3.5 text-sm font-semibold text-[#3E475E] transition-colors hover:bg-[#c3cfda] disabled:opacity-40 sm:flex-none sm:min-w-[140px]"
              >
                Reset
              </button>
            </div>
          </section>

          <section className="mt-14 md:mt-20">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-[17px] font-semibold text-[#1A1A1A]">
                Pomodoro sessions
              </h2>
              <span className="rounded-full bg-[#EEF1F4] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                {completedCount} / {pomodoros.length} done
              </span>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {pomodoros.length === 0 ? (
                <p className="rounded-xl border border-dashed border-[#D1D5DB] py-12 text-center text-sm text-[#6B7280]">
                  No sessions yet. Add a Pomodoro to start focusing.
                </p>
              ) : (
                pomodoros.map((p) => {
                  const sel = p.id === selectedId;
                  const done = isPomodoroCompleted(p);
                  const run = isPomodoroRunning(p);
                  const rem = pomodoroRemainingSeconds(p);
                  const showTime = run || (!done && (p.elapsedSeconds ?? 0) > 0);
                  return (
                    <div
                      key={p.id}
                      className={`flex w-full items-stretch overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md ${
                        sel
                          ? "border-[#3E475E] ring-1 ring-[#3E475E]"
                          : "border-[#E8EAED]"
                      }`}
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => void onTileTapped(p)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            void onTileTapped(p);
                          }
                        }}
                        className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 px-4 py-4 text-left outline-none focus-visible:bg-[#F9FAFB]"
                      >
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg ${
                            done
                              ? "bg-emerald-100 text-emerald-700"
                              : run
                                ? "bg-[#3E475E]/15 text-[#3E475E]"
                                : "bg-[#F3F4F6] text-[#6B7280]"
                          }`}
                          aria-hidden
                        >
                          {done ? "✓" : run ? "⏱" : "○"}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`truncate font-medium text-[#1A1A1A] ${
                              done ? "text-[#9CA3AF] line-through" : ""
                            }`}
                          >
                            {p.title}
                          </p>
                          {showTime ? (
                            <p className="mt-0.5 text-xs font-medium text-[#6B7280]">
                              {formatMmSs(rem)} left
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-1 border-l border-[#E8EAED] bg-white px-2 py-2">
                        {!done ? (
                          <>
                            <button
                              type="button"
                              onClick={(e) => void onRowReset(p, e)}
                              className="rounded-md px-2 py-1 text-xs font-semibold text-[#6B7280] hover:bg-[#F3F4F6]"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={(e) => void onRowComplete(p, e)}
                              className="rounded-md px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                            >
                              Done
                            </button>
                          </>
                        ) : null}
                        <button
                          type="button"
                          onClick={(e) => void onRowDelete(p, e)}
                          className="rounded-md px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <DashedAddTile
              variant="prominent"
              onClick={() => setAddOpen(true)}
              className="mt-6 bg-white py-8"
              ariaLabel="Add pomodoro session"
            />
          </section>
        </>
      )}

      <AddPomodoroModal
        open={addOpen}
        taskTitle={taskTitle}
        onClose={() => setAddOpen(false)}
        onCreate={async (input) => {
          const id = await createPomodoro({
            todoId,
            title: input.title,
            timerDurationInMinutes: input.timerDurationInMinutes,
          });
          if (!id) throw new Error("Could not create session.");
          await loadPomodoros(true);
        }}
      />
    </div>
  );
}
