import type { CreateUserUseCase } from "@kairos/core/user";
import { BaseController } from "../common/controller/base.controller.ts";
import { createUserRoute } from "./user.routes.ts";

export class UserController extends BaseController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {
    super();
  }

  register() {
    this.router.openapi(createUserRoute, async (c) => {
      const body = c.req.valid("json");
      const user = await this.createUserUseCase.execute({
        id: body.id,
        email: body.email,
        name: body.name,
        preferences: body.preferences,
      });
      return c.json(user, 201);
    });

    return this.router;
  }
}
