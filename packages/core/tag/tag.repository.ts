import type {
  FindTagByNameParams,
  FindTagsByNamesParams,
} from "@kairos/shared/types";
import type { UserScopedRepository } from "../common/base.repository.ts";
import type {
  Tag,
  TagFilterableFields,
  TagSortableFields,
} from "./tag.entity.ts";

export interface TagRepository
  extends UserScopedRepository<Tag, TagSortableFields, TagFilterableFields> {
  findByName(params: FindTagByNameParams): Promise<Tag | null>;
  findByNames(params: FindTagsByNamesParams): Promise<Tag[]>;
}
