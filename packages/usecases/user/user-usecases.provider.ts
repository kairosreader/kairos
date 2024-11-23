import type { Container, Module } from "@kairos/di";
import { AUTH_TOKENS, USECASES_TOKENS } from "@kairos/di/tokens";
import {
  CreateUserUseCase,
  DeleteUserUseCase,
  type UserService,
} from "@kairos/core/user";
import type { IdentityService } from "@kairos/core/auth";
import type { SpecialCollectionService } from "@kairos/core/collection";

export class UserUseCasesProvider implements Module {
  register(container: Container): void {
    container.registerSingleton(USECASES_TOKENS.User.CreateUserUseCase, () => {
      const userService = container.resolve<UserService>(
        USECASES_TOKENS.User.UserService,
      );
      const specialCollectionService = container.resolve<
        SpecialCollectionService
      >(
        USECASES_TOKENS.Collection.SpecialCollectionService,
      );
      return new CreateUserUseCase(userService, specialCollectionService);
    });

    container.registerSingleton(USECASES_TOKENS.User.DeleteUserUseCase, () => {
      const userService = container.resolve<UserService>(
        USECASES_TOKENS.User.UserService,
      );
      const identityService = container.resolve<IdentityService>(
        AUTH_TOKENS.IdentityService,
      );
      return new DeleteUserUseCase(userService, identityService);
    });
  }
}
