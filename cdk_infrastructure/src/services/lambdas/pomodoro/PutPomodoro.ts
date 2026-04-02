import {
  DynamoDBClient,
  GetItemCommand,
  QueryCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { parseJson } from "../../shared/Utils";
import { notifyUser } from "../../shared/WebSocketNotifier";

/**
 * Handles PUT /pomodoros to update a pomodoro's timer state.
 *
 * Supported actions:
 *  - "start"    → sets startedAt to the current server timestamp, status = "running"
 *  - "pause"    → accumulates elapsed time server-side, clears startedAt, status = "stopped"
 *  - "reset"    → clears startedAt, elapsedSeconds, status = "stopped"
 *  - "complete" → status = "completed"
 */
export async function putPomodoro(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const body = parseJson(event.body);

  const { userId, todoId, pomodoroId, action } = body;

  if (!userId || !todoId || !pomodoroId || !action) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "userId, todoId, pomodoroId, and action are required.",
      }),
    };
  }

  const PK = `USER#${userId}`;
  const SK = `ITEM#POMODORO#${todoId}#${pomodoroId}`;

  if (action === "start") {
    const now = new Date().toISOString();
    // check if there is already timers running for this todo
    const activeCheck = await ddbClient.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        FilterExpression: "#st = :running",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":pk": { S: PK },
          ":skPrefix": { S: `ITEM#POMODORO#${todoId}` },
          ":running": { S: "running" },
        },
      }),
    );

    if (activeCheck.Items && activeCheck.Items.length > 0) {
      const active = unmarshall(activeCheck.Items[0]);
      return {
        statusCode: 409,
        body: JSON.stringify({
          message: "Another pomodoro is already running.",
          activeId: active.id,
        }),
      };
    }

    // UpdateItem silently creates an item if the key doesn't exist,
    // which would produce a partial/phantom record with no title, duration, etc.
    const existsCheck = await ddbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: { S: PK }, SK: { S: SK } },
      }),
    );

    if (!existsCheck.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Pomodoro not found." }),
      };
    }

    await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: { S: PK },
          SK: { S: SK },
        },
        UpdateExpression: "SET startedAt = :ts, #st = :status",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":ts": { S: now },
          ":status": { S: "running" },
        },
      }),
    );

    await notifyUser(
      userId,
      {
        type: "pomodoro_update",
        action: "started",
        data: { pomodoroId, todoId, startedAt: now, status: "running" },
      },
      ddbClient,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ startedAt: now, status: "running" }),
    };
  }

  if (action === "pause") {
    const existing = await ddbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: { S: PK }, SK: { S: SK } },
      }),
    );

    if (!existing.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Pomodoro not found." }),
      };
    }

    const item = unmarshall(existing.Item);
    const previousElapsed: number = item.elapsedSeconds ?? 0;

    let additionalSeconds = 0;
    if (item.startedAt) {
      const startedMs = new Date(item.startedAt).getTime();
      additionalSeconds = Math.floor((Date.now() - startedMs) / 1000);
    }

    const newElapsed = previousElapsed + additionalSeconds;

    await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: { S: PK }, SK: { S: SK } },
        UpdateExpression:
          "SET elapsedSeconds = :es, #st = :status REMOVE startedAt",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":es": { N: String(newElapsed) },
          ":status": { S: "stopped" },
        },
      }),
    );

    await notifyUser(
      userId,
      {
        type: "pomodoro_update",
        action: "paused",
        data: { pomodoroId, todoId, elapsedSeconds: newElapsed, status: "stopped" },
      },
      ddbClient,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ elapsedSeconds: newElapsed, status: "stopped" }),
    };
  }

  if (action === "reset") {
    // Same as "start" — guard against UpdateItem creating a phantom record
    const existing = await ddbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: { S: PK }, SK: { S: SK } },
      }),
    );

    if (!existing.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Pomodoro not found." }),
      };
    }

    await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: { S: PK }, SK: { S: SK } },
        UpdateExpression:
          "SET elapsedSeconds = :zero, #st = :status REMOVE startedAt",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":zero": { N: "0" },
          ":status": { S: "stopped" },
        },
      }),
    );

    await notifyUser(
      userId,
      {
        type: "pomodoro_update",
        action: "reset",
        data: { pomodoroId, todoId, elapsedSeconds: 0, status: "stopped" },
      },
      ddbClient,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ reset: true, status: "stopped" }),
    };
  }

  if (action === "complete") {
    // Guard against UpdateItem creating a phantom record
    const existing = await ddbClient.send(
      new GetItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: { PK: { S: PK }, SK: { S: SK } },
      }),
    );

    if (!existing.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Pomodoro not found." }),
      };
    }

    await ddbClient.send(
      new UpdateItemCommand({
        TableName: process.env.TABLE_NAME,
        Key: {
          PK: { S: PK },
          SK: { S: SK },
        },
        UpdateExpression: "SET #st = :status REMOVE startedAt",
        ExpressionAttributeNames: { "#st": "status" },
        ExpressionAttributeValues: {
          ":status": { S: "completed" },
        },
      }),
    );

    await notifyUser(
      userId,
      {
        type: "pomodoro_update",
        action: "completed",
        data: { pomodoroId, todoId, status: "completed" },
      },
      ddbClient,
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "completed" }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({
      message: `Unknown action "${action}". Use "start", "pause", "reset", or "complete".`,
    }),
  };
}
