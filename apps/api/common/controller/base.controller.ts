import type { OpenAPIHono } from "@hono/zod-openapi";
import type { AppEnv } from "./controller.types.ts";
import { createRouter } from "./controller.utils.ts";

export abstract class BaseController {
  protected router: OpenAPIHono<AppEnv>;

  constructor() {
    this.router = createRouter();
    this.register = this.register.bind(this);
  }

  abstract register(): OpenAPIHono<AppEnv>;
}
