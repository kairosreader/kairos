import type { ItemTag } from "@kairos/shared/types/common";
import { UserScopedService } from "../common/base.service.ts";
import type {
  Item,
  ItemFilterableFields,
  ItemSortableFields,
  ReadingProgress,
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

  async removeTagsFromItems(
    itemIds: string[],
    tagIds: string[],
  ): Promise<void> {
    await this.itemRepo.removeTagsFromItems(itemIds, tagIds);
  }

  async addTagsToItem(itemId: string, tags: ItemTag[]): Promise<void> {
    await this.itemRepo.addTagsToItem(itemId, tags);
  }

  async updateTagInfo(
    tagId: string,
    updates: Partial<Omit<ItemTag, "id">>,
  ): Promise<void> {
    await this.itemRepo.updateTagInfo(tagId, updates);
  }

  async replaceTags(itemId: string, tags: ItemTag[]): Promise<void> {
    await this.itemRepo.replaceTags(itemId, tags);
  }

  async bulkReplaceTags(itemIds: string[], tags: ItemTag[]): Promise<void> {
    await this.itemRepo.bulkReplaceTags(itemIds, tags);
  }

  async updateReadingProgress(itemId: string, progress: ReadingProgress) {
    await this.itemRepo.updateReadingProgress(itemId, progress);
  }
}
