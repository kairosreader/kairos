import type { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "./controller.types.ts";
import { createRouter } from "./controller.utils.ts";

export abstract class BaseController {
  protected router: OpenAPIHono<AppEnv>;

  constructor() {
    this.router = createRouter();

    // Register security schemes
    this.router.openAPIRegistry.registerComponent(
      "securitySchemes",
      "Session",
      {
        type: "apiKey",
        in: "cookie",
        name: "ory_kratos_session",
        description: "Ory Kratos session cookie",
      },
    );

    this.router.openAPIRegistry.registerComponent(
      "securitySchemes",
      "InternalAPIKey",
      {
        type: "apiKey",
        in: "header",
        name: "x-api-key",
        description: "Internal API key for service-to-service communication",
      },
    );

    this.register = this.register.bind(this);
  }

  abstract register(): OpenAPIHono<AppEnv>;
}
