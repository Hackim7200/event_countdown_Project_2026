"use client";

/**
 * Auth helpers for Countdown REST calls (same role as Flutter `AuthService`).
 * Replaces the old commented stub (Amplify v5 / other project).
 */
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

export async function getUserId(): Promise<string | null> {
  try {
    const u = await getCurrentUser();
    return u.userId;
  } catch {
    return null;
  }
}

/**
 * API Gateway uses a Cognito User Pools authorizer (`Authorization: Bearer <idToken>`).
 * Amplify REST otherwise prefers IAM (Identity Pool) signing when no `Authorization` header
 * is set, which this API does not accept — requests then return 401.
 */
export async function bearerAuthHeaders(): Promise<Record<string, string>> {
  const session = await fetchAuthSession();
  const idToken = session.tokens?.idToken;
  if (!idToken) return {};
  return { Authorization: `Bearer ${idToken.toString()}` };
}
