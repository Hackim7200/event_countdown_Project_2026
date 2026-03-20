import {
  DeleteItemCommand,
  DynamoDBClient,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { hasAdminGroup } from "../../shared/Utils";

export async function deleteEvent(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const params = event.queryStringParameters ?? {};
  const userId = params.userId;
  const id = params.id;

  if (!userId || !id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Please provide userId and id." }),
    };
  }

  const PK = `USER#${userId}`;

  const queryResult = await ddbClient.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      FilterExpression: "#id = :id",
      ExpressionAttributeNames: { "#id": "id" },
      ExpressionAttributeValues: {
        ":pk": { S: PK },
        ":skPrefix": { S: "ITEM#EVENT#" },
        ":id": { S: id },
      },
    }),
  );

  const items = queryResult.Items ?? [];
  if (items.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: `Event not found with id: ${id}` }),
    };
  }

  const item = unmarshall(items[0]);
  const SK = item.SK;

  await ddbClient.send(
    new DeleteItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: { S: PK },
        SK: { S: SK },
      },
    }),
  );

  return {
    statusCode: 200,
    body: JSON.stringify(`Item ${id} deleted successfully`),
  };
}
