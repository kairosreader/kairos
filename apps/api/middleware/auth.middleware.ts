import type { Context, Next } from "@hono/hono";
import { UnauthorizedError } from "@kairos/shared/types/errors";
import type { AppEnv } from "../common/controller/controller.types.ts";

const AUTH_URL = Deno.env.get("AUTH_URL")!;

export async function authMiddleware(c: Context<AppEnv>, next: Next) {
  const cookies = c.req.header("cookie");
  console.log("Received cookies:", cookies);

  const sessionToken = cookies?.match(/ory_kratos_session=([^;]+)/)?.[1];
  console.log("Extracted session token:", sessionToken);

  if (!sessionToken) {
    throw new UnauthorizedError("No session found");
  }

  try {
    const response = await fetch(`${AUTH_URL}/sessions/whoami`, {
      method: "GET",
      headers: {
        Cookie: `ory_kratos_session=${sessionToken}`,
      },
      credentials: "include",
    });

    console.log("Kratos response status:", response.status);
    const responseText = await response.text();
    console.log("Kratos response body:", responseText);

    if (!response.ok) {
      throw new UnauthorizedError(`Invalid session: ${responseText}`);
    }

    const session = JSON.parse(responseText);

    // Set user context
    c.set("user", {
      id: session.identity.id,
      email: session.identity.traits.email,
      firstName: session.identity.traits.name?.first,
      lastName: session.identity.traits.name?.last,
    });

    await next();
  } catch (error) {
    console.error("Error verifying session:", error);
    throw new UnauthorizedError("Invalid session");
  }
}
