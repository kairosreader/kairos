import type { FindTagByNameParams } from "@kairos/shared/types";
import type { UserScopedRepository } from "../common/base.repository.ts";
import type { Tag } from "./tag.entity.ts";

export interface TagRepository extends UserScopedRepository<Tag> {
  findByName(params: FindTagByNameParams): Promise<Tag | null>;
}
