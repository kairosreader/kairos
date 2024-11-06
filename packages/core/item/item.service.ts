import { UserScopedService } from "@core/common/base.service.ts";
import { Item } from "@core/item/item.entity.ts";
import { ItemRepository } from "@core/item/item.repository.ts";

export class ItemService<T> extends UserScopedService<Item<T>> {
  protected override resourceName: string;
  constructor(protected itemRepo: ItemRepository<T>) {
    super(itemRepo);
    this.resourceName = "Item";
  }
}
