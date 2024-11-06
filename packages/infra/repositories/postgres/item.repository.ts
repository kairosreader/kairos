import { Item, ItemRepository, ReadingProgress } from "@core/item/mod.ts";
import { ItemContent } from "@shared/types/common/mod.ts";
import { ItemParams, UserScopedParams } from "@shared/types/params/mod.ts";
import { ItemType } from "@shared/constants/mod.ts";
import { ItemNotFoundError } from "@shared/types/errors/mod.ts";

export class PostgresItemRepository implements ItemRepository<ItemContent> {
  findByUserAndType(
    params: ItemParams & { type?: ItemType },
  ): Promise<Item<ItemContent>[]> {
    return Promise.resolve([]);
  }
  updateReadingProgress(progress: ReadingProgress): Promise<void> {
    return Promise.resolve();
  }
  findByUser(userId: string): Promise<Item<ItemContent>[]> {
    throw new ItemNotFoundError("Method not implemented.");
  }
  delete(params: UserScopedParams): Promise<void> {
    return Promise.resolve();
  }
  findById(id: string): Promise<Item<ItemContent> | null> {
    return Promise.resolve(null);
  }
  save(entity: Item<ItemContent>): Promise<Item<ItemContent>> {
    return Promise.resolve(entity);
  }
  update(
    id: string,
    updates: Partial<Item<ItemContent>>,
  ): Promise<Item<ItemContent>> {
    return Promise.resolve({} as Item<ItemContent>);
  }
}
