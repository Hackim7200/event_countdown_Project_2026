"use client";

import { del, get, post, put } from "aws-amplify/api";
import { bearerAuthHeaders, getUserId } from "@/src/app/services/AuthService";
import type { PomodoroRecord } from "@/src/features/pomodoro/pomodoro-model";

export async function fetchPomodorosForTodo(
  todoId: string,
): Promise<PomodoroRecord[]> {
  const userId = await getUserId();
  if (!userId) throw new Error("Not signed in");

  const headers = await bearerAuthHeaders();
  const { body, statusCode } = await get({
    apiName: "CountdownApi",
    path: "/pomodoros",
    options: {
      headers,
      queryParams: { userId, todoId },
    },
  }).response;

  if (statusCode !== 200) {
    throw new Error(`Failed to load pomodoros (${String(statusCode)})`);
  }

  const json = (await body.json()) as unknown;
  if (!Array.isArray(json)) return [];
  return json as PomodoroRecord[];
}

export async function createPomodoro(input: {
  todoId: string;
  title: string;
  timerDurationInMinutes: number;
}): Promise<string | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const headers = await bearerAuthHeaders();
  const { body, statusCode } = await post({
    apiName: "CountdownApi",
    path: "/pomodoros",
    options: {
      headers,
      body: {
        userId,
        todoId: input.todoId,
        title: input.title,
        timerDurationInMinutes: input.timerDurationInMinutes,
      },
    },
  }).response;

  if (statusCode !== 200 && statusCode !== 201) return null;
  const json = (await body.json()) as { id?: string };
  return json.id ?? null;
}

export async function startPomodoro(input: {
  pomodoroId: string;
  todoId: string;
}): Promise<string | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const headers = await bearerAuthHeaders();
  const { body, statusCode } = await put({
    apiName: "CountdownApi",
    path: "/pomodoros",
    options: {
      headers,
      body: {
        userId,
        todoId: input.todoId,
        pomodoroId: input.pomodoroId,
        action: "start",
      },
    },
  }).response;

  if (statusCode === 409) return null;
  if (statusCode !== 200) return null;
  const json = (await body.json()) as { startedAt?: string };
  return json.startedAt ?? null;
}

export async function pausePomodoro(input: {
  pomodoroId: string;
  todoId: string;
}): Promise<number | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const headers = await bearerAuthHeaders();
  const { body, statusCode } = await put({
    apiName: "CountdownApi",
    path: "/pomodoros",
    options: {
      headers,
      body: {
        userId,
        todoId: input.todoId,
        pomodoroId: input.pomodoroId,
        action: "pause",
      },
    },
  }).response;

  if (statusCode !== 200) return null;
  const json = (await body.json()) as { elapsedSeconds?: number };
  return json.elapsedSeconds ?? null;
}

export async function resetPomodoro(input: {
  pomodoroId: string;
  todoId: string;
}): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const headers = await bearerAuthHeaders();
  const { statusCode } = await put({
    apiName: "CountdownApi",
    path: "/pomodoros",
    options: {
      headers,
      body: {
        userId,
        todoId: input.todoId,
        pomodoroId: input.pomodoroId,
        action: "reset",
      },
    },
  }).response;

  return statusCode === 200;
}

export async function completePomodoro(input: {
  pomodoroId: string;
  todoId: string;
}): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const headers = await bearerAuthHeaders();
  const { statusCode } = await put({
    apiName: "CountdownApi",
    path: "/pomodoros",
    options: {
      headers,
      body: {
        userId,
        todoId: input.todoId,
        pomodoroId: input.pomodoroId,
        action: "complete",
      },
    },
  }).response;

  return statusCode === 200;
}

export async function deletePomodoro(input: {
  pomodoroId: string;
  todoId: string;
}): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const headers = await bearerAuthHeaders();
  const { statusCode } = await del({
    apiName: "CountdownApi",
    path: "/pomodoros",
    options: {
      headers,
      queryParams: {
        userId,
        todoId: input.todoId,
        pomodoroId: input.pomodoroId,
      },
    },
  }).response;

  return statusCode === 200;
}
