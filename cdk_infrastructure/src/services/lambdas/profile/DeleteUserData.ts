import {
  BatchWriteItemCommand,
  DynamoDBClient,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

/** DynamoDB only lets you delete up to this many rows in one batch request. */
const MAX_DELETES_PER_BATCH = 25;

/**
 * Wipes this user’s app data from our database (todos, events, pomodoros, and anything
 * else stored under their user partition).
 *
 * This does **not** remove their login account in Cognito—that is handled separately
 * in the mobile app (for example `Amplify.Auth.deleteUser()`).
 */
export async function deleteUserData(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const queryParams = event.queryStringParameters ?? {};
  const userId = queryParams.userId;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message:
          "We couldn’t delete your data because no user id was provided. Try again or contact support.",
      }),
    };
  }

  // API Gateway + Cognito: only allow deleting the partition for the signed-in user (matches Flutter `getUserId()` = sub).
  const claims = event.requestContext.authorizer?.claims as
    | Record<string, string>
    | undefined;
  const tokenSub = claims?.sub;
  if (tokenSub != null && tokenSub !== "" && userId !== tokenSub) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message:
          "You can only delete data for the account you are signed in with.",
      }),
    };
  }

  const tableName = process.env.TABLE_NAME!;
  // Everything for one user lives under this partition key (matches how we save todos and events).
  const userPartitionKey = `USER#${userId}`;

  // DynamoDB returns at most ~1MB of rows per Query; this cursor fetches the next page (separate from the 25-delete batch limit below).
  let startOfNextPage: Record<string, AttributeValue> | undefined;
  let itemsRemoved = 0;

  do {
    const page = await ddbClient.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": { S: userPartitionKey },
        },
        // this query returns the pk + sk of the items to be deleted
        ProjectionExpression: "PK, SK",
        ExclusiveStartKey: startOfNextPage,
      }),
    );

    const rowsOnThisPage = page.Items ?? []; // this is the list of pk + sk of the items to be deleted
    startOfNextPage = page.LastEvaluatedKey;

    // Send deletes in small batches—AWS caps how many you can do at once.
    for (let i = 0; i < rowsOnThisPage.length; i += MAX_DELETES_PER_BATCH) {
      const batch = rowsOnThisPage.slice(i, i + MAX_DELETES_PER_BATCH);
      await ddbClient.send(
        new BatchWriteItemCommand({
          RequestItems: {
            [tableName]: batch.map((row) => ({
              DeleteRequest: {
                // Each row is identified by partition key + sort key together.
                Key: { PK: row.PK!, SK: row.SK! },
              },
            })),
          },
        }),
      );
      itemsRemoved += batch.length;
    }
  } while (startOfNextPage);

  return {
    statusCode: 200,
    body: JSON.stringify({
      message:
        "Your app data has been removed. Your login account may still exist until it is deleted separately.",
      itemsRemoved,
    }),
  };
}
