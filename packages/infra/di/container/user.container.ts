import {
  type Container,
  CreateUserUseCase,
  type UserRepository,
  UserService,
} from "@kairos/core";
import { TOKENS } from "../tokens.ts";
import type { Database } from "../../db/connection.ts";
import { DrizzleUserRepository } from "../../db/drizzle/repository/user.repository.ts";

export function configureUserBasicServices(container: Container) {
  // Repository
  container.registerSingleton<UserRepository>(TOKENS.UserRepository, () => {
    const db = container.resolve<Database>(TOKENS.DbClient);
    return new DrizzleUserRepository(db);
  });

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
    return new CreateUserUseCase(userService);
  });
}
