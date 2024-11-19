import type { CreateUserParams } from "@kairos/shared/types";
import type { UserService } from "../user.service.ts";
import type { User } from "../user.entity.ts";
import type { SpecialCollectionService } from "../../collection/special-collection.service.ts";

export class CreateUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly specialCollectionsService: SpecialCollectionService,
  ) {}
  async execute(params: CreateUserParams): Promise<User> {
    const user = await this.userService.create(params);
    await this.specialCollectionsService.ensureSpecialCollections(user.id);
    return user;
  }
}
