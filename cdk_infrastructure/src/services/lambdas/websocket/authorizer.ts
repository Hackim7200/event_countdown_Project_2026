/**
 * WebSocket $connect authorizer.
 *
 * Clients open the socket with ?token=<CognitoIdToken>.
 * This Lambda verifies the JWT against the Cognito User Pool and returns
 * the user's `sub` in the authorizer context so downstream route handlers
 * can identify the caller without re-verifying the token on every frame.
 */

import { APIGatewayRequestAuthorizerEventV2 } from "aws-lambda";
import { CognitoJwtVerifier } from "aws-jwt-verify";

const USER_POOL_ID = process.env.USER_POOL_ID!;
const CLIENT_ID = process.env.CLIENT_ID!;

const verifier = CognitoJwtVerifier.create({
  userPoolId: USER_POOL_ID,
  tokenUse: "id",
  clientId: CLIENT_ID,
});

export async function handler(event: APIGatewayRequestAuthorizerEventV2) {
  const token =
    event.queryStringParameters?.token ??
    event.headers?.authorization;

  if (!token) {
    console.log("No token provided");
    return { isAuthorized: false };
  }

  try {
    const payload = await verifier.verify(token);
    console.log(`Authorized user: ${payload.sub}`);

    return {
      isAuthorized: true,
      context: {
        sub: payload.sub,
      },
    };
  } catch (error) {
    console.log("Token verification failed:", error);
    return { isAuthorized: false };
  }
}
