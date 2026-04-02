/**
 * Broadcasts a JSON message to all WebSocket connections for a given user.
 *
 * Queries the UserConnections GSI to find every connectionId for the user,
 * then pushes the payload via the API Gateway Management API.
 * Stale connections (GoneException / 410) are cleaned up automatically.
 *
 * Best-effort — failures are logged but never propagated so the calling
 * Lambda's HTTP response is unaffected.
 */

import { DynamoDBClient, DeleteItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  GoneException,
} from "@aws-sdk/client-apigatewaymanagementapi";

const CONNECTIONS_TABLE = process.env.CONNECTIONS_TABLE_NAME;
const WS_ENDPOINT = process.env.WEBSOCKET_API_ENDPOINT;

export interface WebSocketNotification {
  type: string;
  action: string;
  data: Record<string, unknown>;
}

export async function notifyUser(
  userId: string,
  notification: WebSocketNotification,
  ddbClient: DynamoDBClient,
): Promise<void> {
  if (!CONNECTIONS_TABLE || !WS_ENDPOINT) return;

  try {
    // Find all connections for this user via the GSI
    const result = await ddbClient.send(
      new QueryCommand({
        TableName: CONNECTIONS_TABLE,
        IndexName: "UserConnections",
        KeyConditionExpression: "userId = :uid",
        ExpressionAttributeValues: { ":uid": { S: userId } },
      }),
    );

    const connections = result.Items ?? [];
    if (connections.length === 0) return;

    const apigw = new ApiGatewayManagementApiClient({ endpoint: WS_ENDPOINT });
    const payload = JSON.stringify(notification);

    const sends = connections
      .map((item) => item.connectionId?.S)
      .filter((id): id is string => !!id)
      .map((id) => postToConnection(apigw, ddbClient, id, CONNECTIONS_TABLE, payload));

    await Promise.allSettled(sends);
  } catch (error) {
    console.log("WebSocket notification failed (non-fatal):", error);
  }
}

/**
 * Sends a payload to a single connection.
 * If the connection is stale (GoneException / 410), clean it up from DynamoDB.
 */
async function postToConnection(
  apigw: ApiGatewayManagementApiClient,
  ddbClient: DynamoDBClient,
  connectionId: string,
  tableName: string,
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
      await ddbClient
        .send(new DeleteItemCommand({
          TableName: tableName,
          Key: { connectionId: { S: connectionId } },
        }))
        .catch(() => {});
    } else {
      console.log(`Failed to post to ${connectionId}:`, error);
    }
  }
}
