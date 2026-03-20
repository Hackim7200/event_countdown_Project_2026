import {
  APIGatewayProxyEvent,
  Context,
  APIGatewayProxyResult,
} from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { postEvent } from "./PostEvent";
import { getEvents } from "./GetEvents";
import { updateEvent } from "./UpdateEvent";
import { deleteEvent } from "./DeleteEvent";
import { JsonError, MissingFieldsError } from "../../validators/TodoValidator";
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
        const getResponse = await getEvents(event, ddbClient);
        response = getResponse;
        break;

      case "POST":
        const postResponse = await postEvent(event, ddbClient);
        response = postResponse;
        break;

      case "PUT":
        const putResponse = await updateEvent(event, ddbClient);
        response = putResponse;
        break;

      case "DELETE":
        const deleteResponse = await deleteEvent(event, ddbClient);
        response = deleteResponse;
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
    if (error instanceof MissingFieldsError) {
      return {
        statusCode: 400,
        body: message,
      };
    }
    if (error instanceof JsonError) {
      return {
        statusCode: 400,
        body: message,
      };
    }
    return {
      statusCode: 500,
      body: message,
    };
  }

  addCorsHeader(response);

  return response;
}

export { handler };
