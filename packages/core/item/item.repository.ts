import { Item, ReadingProgress } from "@core/item/item.entity.ts";
import { ItemParams } from "@shared/types/params/mod.ts";
import { ItemType } from "@shared/constants/mod.ts";
import { UserScopedRepository } from "@core/common/base.repository.ts";

export interface ItemRepository<T> extends UserScopedRepository<Item<T>> {
  findByUserAndType(
    params: ItemParams & { type?: ItemType },
  ): Promise<Item<T>[]>;
  updateReadingProgress(progress: ReadingProgress): Promise<void>;
}
