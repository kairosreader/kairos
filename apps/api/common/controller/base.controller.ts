import { OpenAPIHono } from "@hono/zod-openapi";
import { AppEnv } from "@api/common/controller/controller.types.ts";
import { createRouter } from "@api/common/controller/controller.utils.ts";

export abstract class BaseController {
  protected router: OpenAPIHono<AppEnv>;

  constructor() {
    this.router = createRouter();
    this.register = this.register.bind(this);
  }

  abstract register(): OpenAPIHono<AppEnv>;
}
