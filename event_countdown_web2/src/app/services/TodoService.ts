"use client";

import { del, get, post } from "aws-amplify/api";
import { bearerAuthHeaders, getUserId } from "@/src/app/services/AuthService";

export type CountdownTodoDto = {
  id: string;
  title: string;
  timePeriod?: string;
  completed?: boolean;
  date?: string;
  dueDate?: string;
  pomodoros?: number;
};

function localDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function fetchCountdownTodosForDate(forDate: Date) {
  const userId = await getUserId();
  if (!userId) return [] as CountdownTodoDto[];

  const headers = await bearerAuthHeaders();
  const { body, statusCode } = await get({
    apiName: "CountdownApi",
    path: "/todos",
    options: {
      queryParams: { userId, date: localDateKey(forDate) },
      headers,
    },
  }).response;

  if (statusCode !== 200) {
    return [];
  }

  const json = (await body.json()) as unknown;
  if (!Array.isArray(json)) return [];
  return json as CountdownTodoDto[];
}

export async function createCountdownTodo(input: {
  title: string;
  dueDate: Date;
  timePeriod: string;
}): Promise<void> {
  const userId = await getUserId();
  if (!userId) throw new Error("Not signed in");

  const headers = await bearerAuthHeaders();
  const { body, statusCode } = await post({
    apiName: "CountdownApi",
    path: "/todos",
    options: {
      headers,
      body: {
        userId,
        title: input.title,
        completed: false,
        date: localDateKey(input.dueDate),
        timePeriod: input.timePeriod,
      },
    },
  }).response;

  if (statusCode === 200 || statusCode === 201) return;

  const text = await body.text();
  throw new Error(
    text || `Could not create task (HTTP ${String(statusCode)})`,
  );
}

export async function deleteCountdownTodo(input: {
  id: string;
  rawDate: string;
}): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const headers = await bearerAuthHeaders();
  const { statusCode } = await del({
    apiName: "CountdownApi",
    path: "/todos",
    options: {
      headers,
      queryParams: { userId, id: input.id, date: input.rawDate },
    },
  }).response;

  return statusCode === 200;
}
