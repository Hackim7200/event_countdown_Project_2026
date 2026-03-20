import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 } from "uuid";
import { validateAsPomodoroEntry } from "../../validators/PomodoroValidator";
import { marshall } from "@aws-sdk/util-dynamodb";
import { parseJson } from "../../shared/Utils";

export async function postPomodoro(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const body = parseJson(event.body);

  // Ensure user has provided all required fields for pomodoro
  validateAsPomodoroEntry(body);

  // Build PK + SK for single-table
  const PK = `USER#${body.userId}`; // userId must be in payload or from auth
  const itemId = v4(); // Generate a random id for the item.
  
  const SK = `ITEM#POMODORO#${body.todoId}#${itemId}`;

  const ddbItem = {
    PK,
    SK,
    id: itemId,
    entityType: "POMODORO",
    title: body.title,
    status: "stopped",
    timerDurationInMinutes: body.timerDurationInMinutes,
    elapsedSeconds: 0,
  };



  await ddbClient.send(
    new PutItemCommand({
      TableName: process.env.TABLE_NAME, // Defined in LambdaStack.ts.
      Item: marshall(ddbItem),
    }),
  );

  // Item: {// this is the marshal format which the db understands and it needs to be provided like so
  //   id: { S: randomId }, // these properties are defined in the DataStack.ts file that is why we are providing it
  //   title: { S: item.title },
  //   year: { N: item.year },
  // },

  return {
    statusCode: 201,
    body: JSON.stringify({ id: itemId }), // Returns the id of the created item.
  };
}
