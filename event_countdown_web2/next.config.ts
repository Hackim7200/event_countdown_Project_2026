import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

/** Stack keys in `../cdk_infrastructure/outputs.json` (CDK `cdk deploy` output). */
const CDK_AUTH_STACK_KEY = "PomodoroPlans-Prod-AuthStack";
const CDK_API_STACK_KEY = "PomodoroPlans-Prod-ApiStack";

function regionFromUserPoolId(userPoolId: string): string {
  const idx = userPoolId.indexOf("_");
  return idx > 0 ? userPoolId.slice(0, idx) : "eu-west-2";
}

/** REST base URL for CountdownApi (CDK output key can include a hash suffix). */
function countdownApiEndpoint(
  api: Record<string, string> | undefined,
): string | undefined {
  if (!api) return undefined;
  for (const [key, value] of Object.entries(api)) {
    if (
      typeof value === "string" &&
      value.startsWith("https://") &&
      value.includes("execute-api") &&
      key.includes("CountdownApi")
    ) {
      return value.replace(/\/$/, "");
    }
  }
  const fallback = Object.values(api).find(
    (v) =>
      typeof v === "string" &&
      v.startsWith("https://") &&
      v.includes("execute-api"),
  );
  return fallback?.replace(/\/$/, "");
}

/**
 * Turbopack only resolves assets inside the Next app root, so CDK outputs are
 * read here (Node) and exposed as NEXT_PUBLIC_* for the Amplify client bundle.
 * Override any key with `.env.local` when needed.
 */
function resolveCdkOutputsPath(): string | undefined {
  const candidates = [
    path.resolve(process.cwd(), "..", "cdk_infrastructure", "outputs.json"),
    path.resolve(process.cwd(), "cdk_infrastructure", "outputs.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
}

function cdkOutputsPublicEnv(): Record<string, string | undefined> {
  const outputsPath = resolveCdkOutputsPath();
  if (!outputsPath) {
    console.warn(
      "[next.config] CDK outputs not found. Tried ../cdk_infrastructure/outputs.json and ./cdk_infrastructure/outputs.json from cwd:",
      process.cwd(),
      "\nUsing amplify defaults from src/app/amplify-env-defaults.ts at runtime if env vars are empty.",
    );
    return {};
  }
  try {
    const raw = fs.readFileSync(outputsPath, "utf8");
    const outputs = JSON.parse(raw) as Record<string, Record<string, string>>;
    const auth = outputs[CDK_AUTH_STACK_KEY];
    const api = outputs[CDK_API_STACK_KEY];

    const out: Record<string, string | undefined> = {};

    if (auth?.UserPoolId) {
      out.NEXT_PUBLIC_COGNITO_USER_POOL_ID = auth.UserPoolId;
      out.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID = auth.UserPoolClientId;
      out.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID = auth.IdentityPoolId;
      out.NEXT_PUBLIC_AWS_REGION = regionFromUserPoolId(auth.UserPoolId);
    }

    const endpoint = countdownApiEndpoint(api);
    if (endpoint) {
      out.NEXT_PUBLIC_COUNTDOWN_API_ENDPOINT = endpoint;
    }

    return out;
  } catch (e) {
    console.warn("[next.config] Failed to read CDK outputs:", outputsPath, e);
    return {};
  }
}

/**
 * Opening the dev server via a LAN URL (e.g. http://192.168.0.88:3000) blocks `/_next/*`
 * unless the host is allowed — scripts then fail to load and the page stays blank.
 * Set `DEV_ALLOWED_ORIGINS` in `.env.local` to a comma-separated list if your IP differs.
 */
const allowedDevOrigins = (process.env.DEV_ALLOWED_ORIGINS ?? "192.168.0.88")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  output: "export",
  // Directory-style URLs (`/support/`) and `support/index.html` in `out/` — aligns with
  // common static hosting and CloudFront “append index.html” patterns.
  trailingSlash: true,
  env: cdkOutputsPublicEnv() as NextConfig["env"],
  allowedDevOrigins,
};

export default nextConfig;
