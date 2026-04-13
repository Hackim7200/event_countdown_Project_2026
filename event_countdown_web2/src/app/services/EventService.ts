"use client";

import { del, get, post } from "aws-amplify/api";
import { bearerAuthHeaders, getUserId } from "@/src/app/services/AuthService";

export type CountdownEventDto = {
  id: string;
  title: string;
  dueDate: string;
  description?: string | null;
  icon?: number;
};

export async function fetchCountdownEvents(futureOrPast: "future" | "past") {
  const userId = await getUserId();
  if (!userId) return [] as CountdownEventDto[];

  const headers = await bearerAuthHeaders();
  const { body, statusCode } = await get({
    apiName: "CountdownApi",
    path: "/events",
    options: {
      queryParams: { userId, futureOrPast },
      headers,
    },
  }).response;

  if (statusCode !== 200) {
    return [];
  }

  const json = (await body.json()) as unknown;
  if (!Array.isArray(json)) return [];
  return json as CountdownEventDto[];
}

export async function fetchCountdownEventById(id: string) {
  const userId = await getUserId();
  if (!userId) return null;

  const headers = await bearerAuthHeaders();
  const { body, statusCode } = await get({
    apiName: "CountdownApi",
    path: "/events",
    options: {
      queryParams: { userId, id },
      headers,
    },
  }).response;

  if (statusCode !== 200) return null;
  return (await body.json()) as CountdownEventDto;
}

export async function createCountdownEvent(input: {
  title: string;
  dueDate: Date;
  description?: string;
  icon: number;
  location?: string;
}): Promise<string | null> {
  const userId = await getUserId();
  if (!userId) return null;

  const headers = await bearerAuthHeaders();
  const { body, statusCode } = await post({
    apiName: "CountdownApi",
    path: "/events",
    options: {
      headers,
      body: {
        userId,
        title: input.title,
        dueDate: input.dueDate.toISOString(),
        description: input.description ?? "",
        icon: input.icon,
        location: input.location ?? "",
      },
    },
  }).response;

  if (statusCode !== 200 && statusCode !== 201) return null;
  const json = (await body.json()) as { id?: string };
  return json.id ?? null;
}

export async function deleteCountdownEvent(id: string): Promise<boolean> {
  const userId = await getUserId();
  if (!userId) return false;

  const headers = await bearerAuthHeaders();
  const { statusCode } = await del({
    apiName: "CountdownApi",
    path: "/events",
    options: {
      headers,
      queryParams: { userId, id },
    },
  }).response;

  return statusCode === 200;
}
