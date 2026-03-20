import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsEventEntry } from "../../validators/EventValidator";
import { marshall } from "@aws-sdk/util-dynamodb";
import { parseJson } from "../../shared/Utils";

export async function postEvent(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const body = parseJson(event.body);
  const itemId = v4();
  body.id = itemId;
  validateAsEventEntry(body);

  const PK = `USER#${body.userId}`;
  const SK = `ITEM#EVENT#${body.dueDate}#${itemId}`;

  const ddbItem = {
    PK,
    SK,
    entityType: "EVENT",
    id: itemId,
    title: body.title,
    dueDate: body.dueDate,
    description: body.description,
    icon: body.icon,
    location: body.location,
  };

  await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME,
      Item: marshall(ddbItem),
    }),
  );

  return {
    statusCode: 201,
    body: JSON.stringify({ id: itemId }),
  };
}
