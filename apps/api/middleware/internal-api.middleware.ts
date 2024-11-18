import type { Context, Next } from "@hono/hono";
import { UnauthorizedError } from "@kairos/shared/types/errors";
import type { AppEnv } from "../common/controller/controller.types.ts";

export async function internalApiMiddleware(c: Context<AppEnv>, next: Next) {
  const authHeader = c.req.header("authorization");
  const expectedToken = Deno.env.get("INTERNAL_API_KEY");
  console.log("authHeader", authHeader);
  console.log("expectedToken", expectedToken);

  if (authHeader !== expectedToken) {
    throw new UnauthorizedError("Invalid internal API key");
  }

  await next();
}
