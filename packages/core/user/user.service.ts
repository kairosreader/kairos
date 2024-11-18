import type { CreateUserParams } from "@kairos/shared";
import { NonUserScopedService } from "../common/base.service.ts";
import type {
  User,
  UserFilterableFields,
  UserSortableFields,
} from "./user.entity.ts";
import type { UserRepository } from "./user.repository.ts";

export class UserService extends NonUserScopedService<
  User,
  UserSortableFields,
  UserFilterableFields
> {
  protected override resourceName: string;
  constructor(private userRepo: UserRepository) {
    super(userRepo);
    this.resourceName = "User";
  }

  create(params: CreateUserParams): Promise<User> {
    return this.userRepo.save({
      ...params,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
