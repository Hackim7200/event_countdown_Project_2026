import {
  DeleteItemCommand,
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { notifyUser } from "../../shared/WebSocketNotifier";

export async function deletePomodoro(
  event: APIGatewayProxyEvent,
  ddbClient: DynamoDBClient,
): Promise<APIGatewayProxyResult> {
  const params = event.queryStringParameters ?? {};
  const userId = params.userId;
  const todoId = params.todoId;
  const pomodoroId = params.pomodoroId;

  if (!userId || !todoId || !pomodoroId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Please provide userId, todoId, and pomodoroId." }),
    };
  }

  const PK = `USER#${userId}`;
  const SK = `ITEM#POMODORO#${todoId}#${pomodoroId}`;

  await ddbClient.send(
    new DeleteItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: { S: PK },
        SK: { S: SK },
      },
    }),
  );

  await notifyUser(
    userId,
    {
      type: "pomodoro_update",
      action: "deleted",
      data: { pomodoroId, todoId },
    },
    ddbClient,
  );

  return {
    statusCode: 200,
    body: JSON.stringify({ message: `Pomodoro ${pomodoroId} deleted successfully` }),
  };
}
