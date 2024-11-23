import type { ResourceIdentifier, UserScoped } from "@kairos/shared/types";
import type { UserScopedRepository } from "../common/base.repository.ts";
import type {
  Item,
  ItemFilterableFields,
  ItemSortableFields,
  ReadingProgress,
} from "./item.entity.ts";
import type { ItemType } from "@kairos/shared/constants";

export interface ItemRepository<T> extends
  UserScopedRepository<
    Item<T>,
    ItemSortableFields,
    ItemFilterableFields
  > {
  findByUserAndType(
    params: ResourceIdentifier & { type?: ItemType },
  ): Promise<Item<T>[]>;
  findByUserAndTag(params: UserScoped & { tagId: string }): Promise<Item<T>[]>;
  removeTagsFromItems(ids: string[], tagId: string[]): Promise<void>;
  updateReadingProgress(id: string, progress: ReadingProgress): Promise<void>;
}
