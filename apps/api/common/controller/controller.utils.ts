import { OpenAPIHono } from "@hono/zod-openapi";
import { errorHandler } from "@api/middleware/error.middleware.ts";
import { pinoLogger } from "@api/middleware/pino-logger.middleware.ts";
import { AppEnv } from "@api/common/controller/controller.types.ts";

export function createRouter() {
  const router = new OpenAPIHono<AppEnv>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return errorHandler(result.error, c);
      }
    },
  });

  router.onError(errorHandler);
  router.use("*", pinoLogger());

  return router;
}
