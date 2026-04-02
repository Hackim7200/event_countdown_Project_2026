/**
 * Main WebSocket handler for $connect, $disconnect, and $default routes.
 *
 * - $connect:    Stores the connectionId + userId in DynamoDB.
 * - $disconnect: Removes the connectionId from DynamoDB.
 * - $default:    Fans the message out to all other connections belonging to
 *                the same userId (same Cognito sub, different devices/tabs).
 *
 * The CONNECTIONS_TABLE_NAME env var and UserConnections GSI are required.
 * The API Gateway Management API endpoint is derived from each event's
 * domainName + stage (available in requestContext).
 */

import { APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBClient, PutItemCommand, DeleteItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  GoneException,
} from "@aws-sdk/client-apigatewaymanagementapi";

const TABLE_NAME = process.env.CONNECTIONS_TABLE_NAME!;
const ddb = new DynamoDBClient({});

// Typed loosely because API Gateway WebSocket events don't have a first-party type in @types/aws-lambda
interface WebSocketEvent {
  requestContext: {
    routeKey: string;
    connectionId: string;
    domainName: string;
    stage: string;
    authorizer?: { sub?: string };
  };
  body?: string;
}

export async function handler(event: WebSocketEvent): Promise<APIGatewayProxyResultV2> {
  const { routeKey, connectionId, domainName, stage } = event.requestContext;

  switch (routeKey) {
    case "$connect":
      return handleConnect(event, connectionId);

    case "$disconnect":
      return handleDisconnect(connectionId);

    case "$default":
      return handleDefault(event, connectionId, domainName, stage);

    default:
      console.log(`Unknown routeKey: ${routeKey}`);
      return { statusCode: 400, body: "Unknown route." };
  }
}

// ─── $connect ────────────────────────────────────────────────────────────────

async function handleConnect(event: WebSocketEvent, connectionId: string): Promise<APIGatewayProxyResultV2> {
  const userId = event.requestContext.authorizer?.sub;
  if (!userId) {
    console.log("No sub in authorizer context – rejecting.");
    return { statusCode: 403, body: "Forbidden." };
  }

  await ddb.send(
    new PutItemCommand({
      TableName: TABLE_NAME,
      Item: {
        connectionId: { S: connectionId },
        userId: { S: userId },
      },
    }),
  );

  console.log(`Connected: ${connectionId} for user ${userId}`);
  return { statusCode: 200, body: "Connected." };
}

// ─── $disconnect ─────────────────────────────────────────────────────────────

async function handleDisconnect(connectionId: string): Promise<APIGatewayProxyResultV2> {
  try {
    await ddb.send(
      new DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: { connectionId: { S: connectionId } },
      }),
    );
    console.log(`Disconnected: ${connectionId}`);
  } catch (error) {
    // Best-effort cleanup; connection may already have been removed
    console.log(`Error removing connection ${connectionId}:`, error);
  }
  return { statusCode: 200, body: "Disconnected." };
}

// ─── $default (fan-out to same user's other connections) ─────────────────────

async function handleDefault(
  event: WebSocketEvent,
  senderConnectionId: string,
  domainName: string,
  stage: string,
): Promise<APIGatewayProxyResultV2> {
  const userId = event.requestContext.authorizer?.sub;
  if (!userId) {
    return { statusCode: 403, body: "Forbidden." };
  }

  // Find all connections for this user via the GSI
  const result = await ddb.send(
    new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: "UserConnections",
      KeyConditionExpression: "userId = :uid",
      ExpressionAttributeValues: { ":uid": { S: userId } },
    }),
  );

  const connections = result.Items ?? [];
  const payload = event.body ?? "";

  const apigw = new ApiGatewayManagementApiClient({
    endpoint: `https://${domainName}/${stage}`,
  });

  // Fan out to every connection except the sender, these are id int the dynamo db table
  const sends = connections
    .map((item) => item.connectionId?.S)
    .filter((id): id is string => !!id && id !== senderConnectionId)
    .map((targetId) => postToConnection(apigw, targetId, payload));

  await Promise.allSettled(sends);

  return { statusCode: 200, body: "Message sent." };
}

/**
 * Sends a payload to a single connection.
 * If the connection is stale (GoneException / 410), clean it up from DynamoDB.
 */
async function postToConnection(
  apigw: ApiGatewayManagementApiClient,
  connectionId: string,
  payload: string,
): Promise<void> {
  try {
    await apigw.send(
      new PostToConnectionCommand({
        ConnectionId: connectionId,
        Data: new TextEncoder().encode(payload),
      }),
    );
  } catch (error) {
    if (error instanceof GoneException) {
      console.log(`Stale connection ${connectionId}, removing from table.`);
      await ddb.send(
        new DeleteItemCommand({
          TableName: TABLE_NAME,
          Key: { connectionId: { S: connectionId } },
        }),
      ).catch(() => {});
    } else {
      console.log(`Failed to post to ${connectionId}:`, error);
    }
  }
}
