import type { NonUserScopedRepository } from "../common/base.repository.ts";
import type {
  User,
  UserFilterableFields,
  UserSortableFields,
} from "./user.entity.ts";

export interface UserRepository extends
  NonUserScopedRepository<
    User,
    UserSortableFields,
    UserFilterableFields
  > {
  findByEmail(email: string): Promise<User | null>;
}
