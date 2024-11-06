import { FindTagByNameParams } from "@shared/types/params/tag.params.ts";
import type { Tag } from "./tag.entity.ts";
import { UserScopedRepository } from "@core/common/base.repository.ts";

export interface TagRepository extends UserScopedRepository<Tag> {
  findByName(params: FindTagByNameParams): Promise<Tag | null>;
}
