import type { ResourceIdentifier } from "@kairos/shared/types";
import type { UserScopedRepository } from "../common/base.repository.ts";
import type {
  Item,
  ItemFilterableFields,
  ItemSortableFields,
  ReadingProgress,
} from "./item.entity.ts";
import type { ItemType } from "@kairos/shared/constants";
import {} from "./item.entity.ts";

export interface ItemRepository<T>
  extends UserScopedRepository<
    Item<T>,
    ItemSortableFields,
    ItemFilterableFields
  > {
  findByUserAndType(
    params: ResourceIdentifier & { type?: ItemType },
  ): Promise<Item<T>[]>;
  updateReadingProgress(id: string, progress: ReadingProgress): Promise<void>;
}
