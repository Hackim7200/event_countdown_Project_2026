"use client";

import { Amplify } from "aws-amplify";

const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? "";
const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID ?? "";
const identityPoolId = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID ?? "";

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        identityPoolId,
        loginWith: {
          username: true,
        },
      },
    },
  },
  { ssr: true },
);

export function ConfigureAmplify() {
  return null;
}
