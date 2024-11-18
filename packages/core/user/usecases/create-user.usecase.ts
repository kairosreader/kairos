import type { CreateUserParams } from "@kairos/shared/types";
import type { UserService } from "../user.service.ts";
import type { User } from "../user.entity.ts";

export class CreateUserUseCase {
  constructor(private readonly userService: UserService) {}
  execute(params: CreateUserParams): Promise<User> {
    return this.userService.create(params);
  }
}
