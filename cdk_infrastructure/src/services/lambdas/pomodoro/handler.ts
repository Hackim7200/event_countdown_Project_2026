import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postPomodoro } from "./PostPomodoro";
import { getPomodoros } from "./GetPomodoros";
import { putPomodoro } from "./PutPomodoro";
import { deletePomodoro } from "./DeletePomodoro";

import {
  JsonError,
  MissingFieldsError,
} from "../../validators/PomodoroValidator";
import { addCorsHeader } from "../../shared/Utils";

const ddbClient = new DynamoDBClient({});

async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  let response: APIGatewayProxyResult;

  try {
    switch (event.httpMethod) {
      case "GET":
        response = await getPomodoros(event, ddbClient);
        break;

      case "POST":
        const postResponse = await postPomodoro(event, ddbClient);
        response = postResponse;
        break;

      case "PUT":
        response = await putPomodoro(event, ddbClient);
        break;

      case "DELETE":
        response = await deletePomodoro(event, ddbClient);
        break;

      default:
        response = {
          statusCode: 405,
          body: JSON.stringify({ message: "Method not allowed." }),
        };
        break;
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error.";
    let errResponse: APIGatewayProxyResult;
    if (error instanceof MissingFieldsError) {
      errResponse = { statusCode: 400, body: message };
    } else if (error instanceof JsonError) {
      errResponse = { statusCode: 400, body: message };
    } else {
      errResponse = { statusCode: 500, body: message };
    }
    addCorsHeader(errResponse);
    return errResponse;
  }

  addCorsHeader(response);

  return response;
}

export { handler };
