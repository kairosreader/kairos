import type { CreateUserUseCase, DeleteUserUseCase } from "@kairos/core/user";
import { BaseController } from "../common/controller/base.controller.ts";
import { createUserRoute, deleteUserRoute } from "./user.routes.ts";

export class UserController extends BaseController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {
    super();
  }

  register() {
    this.router
      .openapi(createUserRoute, async (c) => {
        const body = c.req.valid("json");
        const user = await this.createUserUseCase.execute({
          id: body.id,
          email: body.email,
          name: body.name,
          preferences: body.preferences,
        });
        return c.json(user, 201);
      })
      .openapi(deleteUserRoute, async (c) => {
        const { id: userId } = c.get("user");
        await this.deleteUserUseCase.execute(userId);
        return c.json(null, 204);
      });

    return this.router;
  }
}
