import { PomodoroEntry } from "../models/PomodoroModel";

// This file handles expected errors and throws understandable messages.

export class MissingFieldsError extends Error {
  constructor(missingFields: string) {
    super(`Value for ${missingFields} is required`);
  }
}
export class JsonError extends Error {}

export function validateAsPomodoroEntry(arg: any) {
  if ((arg as PomodoroEntry).userId === undefined) {
    throw new MissingFieldsError("userId");
  }
  if ((arg as PomodoroEntry).todoId === undefined) {
    throw new MissingFieldsError("todoId");
  }
  if ((arg as PomodoroEntry).title === undefined) {
    throw new MissingFieldsError("title");
  }
  if ((arg as PomodoroEntry).timerDurationInMinutes === undefined) {
    throw new MissingFieldsError("timerDurationInMinutes");
  }
}
