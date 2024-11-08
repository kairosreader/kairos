import { UserScopedService } from "../common/base.service.ts";
import type { Item } from "./item.entity.ts";
import type { ItemRepository } from "./item.repository.ts";

export class ItemService<T> extends UserScopedService<Item<T>> {
  protected override resourceName: string;
  constructor(protected itemRepo: ItemRepository<T>) {
    super(itemRepo);
    this.resourceName = "Item";
  }
}
