import type { ResourceIdentifier } from "@kairos/shared/types";
import type { UserScopedRepository } from "../common/base.repository.ts";
import type { Item, ReadingProgress } from "./item.entity.ts";
import type { ItemType } from "@kairos/shared/constants";

export interface ItemRepository<T> extends UserScopedRepository<Item<T>> {
  findByUserAndType(
    params: ResourceIdentifier & { type?: ItemType },
  ): Promise<Item<T>[]>;
  updateReadingProgress(progress: ReadingProgress): Promise<void>;
}
