import type { Context, Next } from "@hono/hono";
import { UnauthorizedError } from "@kairos/shared/types/errors";
import type { AppEnv } from "../common/controller/controller.types.ts";

export async function authMiddleware(c: Context<AppEnv>, next: Next) {
  const authHeader = c.req.header("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Invalid authorization header");
  }

  const token = authHeader.split(" ")[1];
  // TODO: Implement proper JWT verification
  c.set("userId", "123e4567-e89b-12d3-a456-426614174000");

  await next();
}
