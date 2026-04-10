"use client";

import { TimerControls } from "@/src/features/pomodoro/components/timer-controls";
import "@/src/features/pomodoro/styles/pomodoro.css";

export function PomodoroTimer() {
  return (
    <section className="tsa-pomodoro-stack flex flex-col items-center text-center">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#9CA3AF]">
        Currently Focusing
      </p>
      <p
        className="mt-4 text-[clamp(3.5rem,12vw,5.5rem)] font-bold leading-none tracking-tight text-[#3E475E]"
        aria-label="Pomodoro display 25 minutes"
      >
        25:00
      </p>
      <div className="mt-4 h-px w-[min(100%,320px)] bg-[#1A1A1A]/80" />
      <TimerControls />
    </section>
  );
}
