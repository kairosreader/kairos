import type {
  ItemTag,
  ResourceIdentifier,
  UserScoped,
} from "@kairos/shared/types";
import type { UserScopedRepository } from "../common/base.repository.ts";
import type {
  Item,
  ItemFilterableFields,
  ItemSortableFields,
  ReadingProgress,
} from "./item.entity.ts";
import type { ItemType } from "@kairos/shared/constants";

export interface ItemRepository<T> extends
  UserScopedRepository<
    Item<T>,
    ItemSortableFields,
    ItemFilterableFields
  > {
  findByUserAndType(
    params: ResourceIdentifier & { type?: ItemType },
  ): Promise<Item<T>[]>;

  findByUserAndTag(params: UserScoped & { tagId: string }): Promise<Item<T>[]>;

  /**
   * Remove specified tags from multiple items
   * @param itemIds - IDs of items to update
   * @param tagIds - IDs of tags to remove
   */
  removeTagsFromItems(itemIds: string[], tagIds: string[]): Promise<void>;

  /**
   * Add tags to an item
   * @param itemId - ID of the item to update
   * @param tags - Tags to add
   */
  addTagsToItem(itemId: string, tags: ItemTag[]): Promise<void>;

  /**
   * Update tag information across all items
   * @param tagId - ID of the tag to update
   * @param updates - New tag information
   */
  updateTagInfo(
    tagId: string,
    updates: Partial<Omit<ItemTag, "id">>,
  ): Promise<void>;

  /**
   * Replace all tags in an item
   * @param itemId - ID of the item to update
   * @param tags - New tags
   */
  replaceTags(itemId: string, tags: ItemTag[]): Promise<void>;

  /**
   * Bulk replace tags in multiple items
   * @param itemIds - IDs of items to update
   * @param tags - New tags
   */
  bulkReplaceTags(itemIds: string[], tags: ItemTag[]): Promise<void>;

  updateReadingProgress(id: string, progress: ReadingProgress): Promise<void>;
}
