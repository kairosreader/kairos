import type { Container, Module } from "@kairos/di";
import { USECASES_TOKENS, DB_TOKENS } from "@kairos/di/tokens";
import type { UserRepository } from "@kairos/core/user";
import { UserService } from "@kairos/core/user";

export class UserServicesProvider implements Module {
  register(container: Container): void {
    container.registerSingleton(USECASES_TOKENS.User.UserService, () => {
      const userRepo = container.resolve<UserRepository>(
        DB_TOKENS.UserRepository,
      );
      return new UserService(userRepo);
    });
  }
}
