import type { Context, Next } from "@hono/hono";
import { UnauthorizedError } from "@kairos/shared/types/errors";
import type { AppEnv } from "../common/controller/controller.types.ts";

/**
 * Middleware to protect internal API endpoints using API key authentication
 */
export async function internalApiMiddleware(c: Context<AppEnv>, next: Next) {
  const apiKey = c.req.header("x-api-key");
  const expectedKey = Deno.env.get("INTERNAL_API_KEY");

  if (!apiKey || !expectedKey) {
    throw new UnauthorizedError("Missing API key");
  }

  // Use timing-safe comparison to prevent timing attacks
  const keyMatch = timingSafeEqual(apiKey, expectedKey);
  if (!keyMatch) {
    throw new UnauthorizedError("Invalid API key");
  }

  await next();
}

/**
 * Timing-safe comparison of two strings to prevent timing attacks
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
