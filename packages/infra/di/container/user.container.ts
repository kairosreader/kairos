import {
  type Container,
  CreateUserUseCase,
  DeleteUserUseCase,
  type SpecialCollectionService,
  type UserRepository,
  UserService,
} from "@kairos/core";
import { TOKENS } from "../tokens.ts";
import type { Database } from "../../db/connection.ts";
import { DrizzleUserRepository } from "../../db/drizzle/repository/user.repository.ts";
import { KratosIdentityService } from "../../auth/kratos.service.ts";

export function configureUserBasicServices(container: Container) {
  // Repository
  container.registerSingleton<UserRepository>(TOKENS.UserRepository, () => {
    const db = container.resolve<Database>(TOKENS.DbClient);
    return new DrizzleUserRepository(db);
  });

  container.registerSingleton<KratosIdentityService>(
    TOKENS.IdentityService,
    () => {
      return new KratosIdentityService();
    },
  );

  // Services
  container.registerSingleton<UserService>(TOKENS.UserService, () => {
    const userRepo = container.resolve<UserRepository>(TOKENS.UserRepository);
    return new UserService(userRepo);
  });
}

export function configureUserUseCases(container: Container) {
  // Use Cases
  container.registerSingleton(TOKENS.CreateUserUseCase, () => {
    const userService = container.resolve<UserService>(TOKENS.UserService);
    const specialCollectionsService = container.resolve<
      SpecialCollectionService
    >(
      TOKENS.SpecialCollectionService,
    );
    return new CreateUserUseCase(userService, specialCollectionsService);
  });

  container.registerSingleton(TOKENS.DeleteUserUseCase, () => {
    const userService = container.resolve<UserService>(TOKENS.UserService);
    const identityService = container.resolve<KratosIdentityService>(
      TOKENS.IdentityService,
    );
    return new DeleteUserUseCase(userService, identityService);
  });
}
