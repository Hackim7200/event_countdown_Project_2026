import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";

export async function getEvents(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const params = event.queryStringParameters ?? {};
  const userId = params.userId;
  const eventID = params.id;
  const currentDate = new Date().toISOString();
  const futureOrPast = params.futureOrPast;

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify("Please provide userId."),
    };
  }

  const PK = `USER#${userId}`;

  // #1 Get all the events for a user ITEM#EVENT#
  // #2 Then filter just the single event by id
  if (eventID) {
    const queryResult = await ddbClient.send(
      new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
        FilterExpression: "#id = :id",
        ExpressionAttributeNames: { "#id": "id" },
        ExpressionAttributeValues: {
          ":pk": { S: PK },
          ":skPrefix": { S: "ITEM#EVENT#" },
          ":id": { S: eventID },
        },
      }),
    );
    const items = queryResult.Items ?? [];
    if (items.length === 0) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: `Event not found with id: ${eventID}`,
        }),
      };
    }
    const item = unmarshall(items[0]);
    return {
      statusCode: 200,
      body: JSON.stringify(item),
    };
  }

  // Query all events for user (single SK condition: begins_with), then filter by date in code.
  // Avoids SK range issues with ITEM#EVENT#<date>#<id> and mixed date formats.
  const skPrefix = "ITEM#EVENT#";
  const listResult = await ddbClient.send(
    new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "PK = :pk AND begins_with(SK, :skPrefix)",
      ExpressionAttributeValues: {
        ":pk": { S: PK },
        ":skPrefix": { S: skPrefix },
      },
    }),
  );
  // this is less effiicient because it returns all the events and filters programmatically in code
  // this could be improved using SK filter for event then filter by date in code in DynamoDB
  //if the event grows this will take longer to filter in code and will be less efficient

  const allItems = (listResult.Items ?? []).map((item) => unmarshall(item));
  const now = currentDate;
  const filtered =
    futureOrPast === "future"
      ? allItems.filter((item) => (item.dueDate as string) > now)
      : allItems.filter((item) => (item.dueDate as string) < now);

  return {
    statusCode: 200,
    body: JSON.stringify(filtered),
  };
}
