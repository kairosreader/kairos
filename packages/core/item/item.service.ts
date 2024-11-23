import { UserScopedService } from "../common/base.service.ts";
import type {
  Item,
  ItemFilterableFields,
  ItemSortableFields,
} from "./item.entity.ts";
import type { ItemRepository } from "./item.repository.ts";

export class ItemService<T> extends UserScopedService<
  Item<T>,
  ItemSortableFields,
  ItemFilterableFields
> {
  protected override resourceName: string;

  constructor(protected itemRepo: ItemRepository<T>) {
    super(itemRepo);
    this.resourceName = "Item";
  }

  findByUserAndTag(userId: string, tagId: string): Promise<Item<T>[]> {
    return this.itemRepo.findByUserAndTag({ userId, tagId });
  }

  removeTagsFromItems(ids: string[], tagId: string[]): Promise<void> {
    return this.itemRepo.removeTagsFromItems(ids, tagId);
  }
}
