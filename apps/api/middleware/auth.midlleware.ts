import type { Context, Next } from "@hono/hono";
import { UnauthorizedError } from "@shared/types/errors/mod.ts";
import { AppEnv } from "@api/common/controller/controller.types.ts";

export async function authMiddleware(c: Context<AppEnv>, next: Next) {
  const authHeader = c.req.header("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new UnauthorizedError("Invalid authorization header");
  }

  const token = authHeader.split(" ")[1];
  // TODO: Implement proper JWT verification
  c.set("userId", "user123");

  await next();
}
