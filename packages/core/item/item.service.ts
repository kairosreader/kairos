import { Item, ItemRepository } from "@core/item/mod.ts";
import { UserScopedService } from "@core/common/base.service.ts";

export class ItemService<T> extends UserScopedService<Item<T>> {
  protected override resourceName: string;
  constructor(protected itemRepo: ItemRepository<T>) {
    super(itemRepo);
    this.resourceName = "Item";
  }
}
