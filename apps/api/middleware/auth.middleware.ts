import type { Context, Next } from "@hono/hono";
import { UnauthorizedError } from "@kairos/shared/types/errors";
import type { AppEnv } from "../common/controller/controller.types.ts";

const AUTH_PUBLIC_URL = Deno.env.get("AUTH_PUBLIC_URL")!;

export async function authMiddleware(c: Context<AppEnv>, next: Next) {
  const cookies = c.req.header("cookie");
  const sessionTokenHeader = c.req.header("x-session-token");

  // Try to get session token from header first, then fallback to cookie
  const sessionToken = sessionTokenHeader ||
    cookies?.match(/ory_kratos_session=([^;]+)/)?.[1];

  if (!sessionToken) {
    throw new UnauthorizedError("No session found");
  }

  try {
    const response = await fetch(`${AUTH_PUBLIC_URL}/sessions/whoami`, {
      method: "GET",
      headers: {
        Cookie: `ory_kratos_session=${sessionToken}`,
      },
      credentials: "include",
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new UnauthorizedError(`Invalid session: ${responseText}`);
    }

    const session = JSON.parse(responseText);

    // Set user context
    c.set("user", {
      id: session.identity.id,
      email: session.identity.traits.email,
      name: session.identity.traits.name,
    });

    await next();
  } catch (error) {
    console.error("Error verifying session:", error);
    throw new UnauthorizedError("Invalid session");
  }
}
