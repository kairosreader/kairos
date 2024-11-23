import type { Container } from "@kairos/di";
import { USECASES_TOKENS } from "@kairos/di/tokens";
import type { CreateUserUseCase, DeleteUserUseCase } from "@kairos/core/user";
import { UserController } from "./user.controller.ts";

export function createUserController(container: Container): UserController {
  return new UserController(
    container.resolve<CreateUserUseCase>(
      USECASES_TOKENS.User.CreateUserUseCase,
    ),
    container.resolve<DeleteUserUseCase>(
      USECASES_TOKENS.User.DeleteUserUseCase,
    ),
  );
}
