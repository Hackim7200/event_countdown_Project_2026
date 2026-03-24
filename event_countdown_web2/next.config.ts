
import type { NextConfig } from "next";
import fs from "node:fs";
import path from "node:path";

/**
 * Turbopack only resolves assets inside the Next app root, so CDK outputs are
 * read here (Node) and exposed as NEXT_PUBLIC_* for the Amplify client bundle.
 */
function cdkAuthPublicEnv(): Record<string, string | undefined> {
  const outputsPath = path.resolve(
    process.cwd(),
    "..",
    "cdk_infrastructure",
    "outputs.json",
  );
  try {
    const raw = fs.readFileSync(outputsPath, "utf8");
    const outputs = JSON.parse(raw) as Record<string, Record<string, string>>;
    const auth = outputs["CountdownApp-AuthStack"];
    if (!auth) return {};
    return {
      NEXT_PUBLIC_COGNITO_USER_POOL_ID: auth.UserPoolId,
      NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID: auth.CountdownUserPoolClientId,
      NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID: auth.CountdownIdentityPoolId,
    };
  } catch {
    return {};
  }
}

const nextConfig: NextConfig = {
  output: "export",
  // Directory-style URLs (`/support/`) and `support/index.html` in `out/` — aligns with
  // common static hosting and CloudFront “append index.html” patterns.
  trailingSlash: true,
  env: cdkAuthPublicEnv() as NextConfig["env"],
};

export default nextConfig;
