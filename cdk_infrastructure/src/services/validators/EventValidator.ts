import { EventEntry } from "../models/EventModels";

// This file handles expected errors and throws understandable messages.

export class MissingFieldsError extends Error {
  constructor(missingFields: string) {
    super(`Value for ${missingFields} is required`);
  }
}
export class JsonError extends Error {}

export function validateAsEventEntry(arg: any) {
  if ((arg as EventEntry).userId === undefined) {
    throw new MissingFieldsError("userId");
  }
  if ((arg as EventEntry).title === undefined) {
    throw new MissingFieldsError("title");
  }
  if ((arg as EventEntry).dueDate === undefined) {
    throw new MissingFieldsError("dueDate");
  }
  if ((arg as EventEntry).description === undefined) {
    throw new MissingFieldsError("description");
  }
  if ((arg as EventEntry).location === undefined) {
    throw new MissingFieldsError("location");
  }
  if ((arg as EventEntry).icon === undefined) {
    throw new MissingFieldsError("icon");
  }
}
