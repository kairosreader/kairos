import { Item, ReadingProgress } from "@core/item/mod.ts";
import { ItemParams } from "@shared/types/params/item.params.ts";
import { ItemType } from "@shared/constants/item.constants.ts";
import { UserScopedRepository } from "@core/common/base.repository.ts";

export interface ItemRepository<T> extends UserScopedRepository<Item<T>> {
  findByUserAndType(
    params: ItemParams & { type?: ItemType },
  ): Promise<Item<T>[]>;
  updateReadingProgress(progress: ReadingProgress): Promise<void>;
}
