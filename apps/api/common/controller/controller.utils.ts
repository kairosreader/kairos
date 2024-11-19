import { OpenAPIHono } from "@hono/zod-openapi";
import { cors } from "@hono/hono/cors";
import type { AppEnv } from "./controller.types.ts";
import { errorHandler } from "../../middleware/error.middleware.ts";
import { pinoLogger } from "../../middleware/pino-logger.middleware.ts";

export function createRouter() {
  const router = new OpenAPIHono<AppEnv>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return errorHandler(result.error, c);
      }
    },
  });

  router.use(
    "*",
    cors({
      origin: [`http://localhost:${Deno.env.get("PORT")}`],
      credentials: true,
      allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "Cookie"],
      exposeHeaders: ["Set-Cookie"],
    }),
  );

  router.onError(errorHandler);
  router.use("*", pinoLogger());

  return router;
}
