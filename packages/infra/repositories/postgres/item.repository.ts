import { Item, ItemRepository, ReadingProgress } from "@core/item/mod.ts";
import { ItemContent } from "@shared/types/common/mod.ts";

import { ItemType } from "@shared/constants/mod.ts";
import { ItemNotFoundError } from "@shared/types/errors/mod.ts";
import { ResourceIdentifier } from "@shared/types/params/base.params.ts";


export class PostgresItemRepository implements ItemRepository<ItemContent> {
  findByIds(ids: string[]): Promise<Item<ItemContent>[]> {
    throw new Error("Method not implemented.");
  }
  findByUserAndType(
    params: ResourceIdentifier & { type?: ItemType },
  ): Promise<Item<ItemContent>[]> {
    return Promise.resolve([]);
  }
  updateReadingProgress(progress: ReadingProgress): Promise<void> {
    return Promise.resolve();
  }
  findByUser(userId: string): Promise<Item<ItemContent>[]> {
    throw new ItemNotFoundError("Method not implemented.");
  }
  delete(params: ResourceIdentifier): Promise<void> {
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
