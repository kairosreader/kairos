import { FindTagByNameParams } from "@shared/types/params/mod.ts";
import type { Tag } from "@core/tag/tag.entity.ts";
import { UserScopedRepository } from "@core/common/base.repository.ts";

export interface TagRepository extends UserScopedRepository<Tag> {
  findByName(params: FindTagByNameParams): Promise<Tag | null>;
}
