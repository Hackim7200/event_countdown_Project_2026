"use client";

import { Amplify } from "aws-amplify";
import { AMPLIFY_ENV_DEFAULTS } from "@/src/app/amplify-env-defaults";

function envOrDefault(
  key: keyof typeof AMPLIFY_ENV_DEFAULTS,
  envValue: string | undefined,
): string {
  const trimmed = (envValue ?? "").trim();
  if (trimmed) return trimmed;
  return AMPLIFY_ENV_DEFAULTS[key];
}

/**
 * Prefer `NEXT_PUBLIC_*` from `next.config.ts` (CDK `outputs.json`) or `.env.local`;
 * otherwise use {@link AMPLIFY_ENV_DEFAULTS} so Cognito/API are never configured empty
 * (empty config often surfaces as a generic “network” error in the Authenticator).
 */
const userPoolId = envOrDefault(
  "userPoolId",
  process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
);
const userPoolClientId = envOrDefault(
  "userPoolClientId",
  process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
);
const identityPoolId = envOrDefault(
  "identityPoolId",
  process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID,
);

const countdownApiEndpoint = envOrDefault(
  "countdownApiEndpoint",
  process.env.NEXT_PUBLIC_COUNTDOWN_API_ENDPOINT,
).replace(/\/$/, "");

const awsRegion = envOrDefault(
  "awsRegion",
  process.env.NEXT_PUBLIC_AWS_REGION,
);

Amplify.configure(
  {
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
        identityPoolId,
        // Pool uses `usernameAttributes: ["EMAIL"]` — users sign in with their email + password.
        loginWith: {
          username: true,
          email: true,
        },
      },
    },
    API: {
      REST: {
        CountdownApi: {
          endpoint: countdownApiEndpoint,
          region: awsRegion,
        },
      },
    },
  },
  { ssr: true },
);

export function ConfigureAmplify() {
  return null;
}
