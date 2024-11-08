import type { ItemContent } from "@kairos/shared/types/common";
import type {
  BulkTagItemOperation,
  CreateManyTagsOperation,
  CreateTagParams,
  FindTagByNameParams,
  TagItemOperation,
} from "@kairos/shared/types/params";
import { generateId } from "@kairos/shared/utils";
import { UserScopedService } from "../common/base.service.ts";
import type { ItemService } from "../item/item.service.ts";
import type { Tag } from "./tag.entity.ts";
import type { TagRepository } from "./tag.repository.ts";

export class TagService extends UserScopedService<Tag> {
  protected override resourceName: string;

  constructor(
    private tagRepo: TagRepository,
    private itemService: ItemService<ItemContent>,
  ) {
    super(tagRepo);
    this.resourceName = "Tag";
  }

  findByName(params: FindTagByNameParams): Promise<Tag | null> {
    return this.tagRepo.findByName(params);
  }

  async getOrCreate(params: CreateTagParams): Promise<Tag> {
    const { userId, data } = params;

    // Check if the tag already exists for the user
    let tag = await this.tagRepo.findByName({
      tagName: data.name,
      userId,
    });
    if (!tag) {
      // Create a new tag if it doesn't
      tag = {
        id: generateId(),
        userId: userId,
        name: data.name,
        color: data.color,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await this.tagRepo.save(tag);
    }
    return tag;
  }

  getOrCreateMany(params: CreateManyTagsOperation): Promise<Tag[]> {
    const { userId, tagInfos } = params;

    return Promise.all(
      tagInfos.map((tagInfo) =>
        this.getOrCreate({ userId: userId, data: tagInfo }),
      ),
    );
  }

  async addToItem(params: TagItemOperation): Promise<void> {
    const { userId, itemId, tagIds } = params;

    const item = await this.itemService.tryFindById(itemId);

    // Verify item ownership
    await this.itemService.verifyOwnership({
      id: itemId,
      userId: userId,
    });

    item.tags = [...new Set([...item.tags, ...tagIds])];
    await this.itemService.save(item);
  }

  async bulkAddToItem(params: BulkTagItemOperation): Promise<void> {
    const { userId, itemIds, tagIds } = params;

    // Validate inputs
    if (!itemIds.length || !tagIds.length) {
      return;
    }

    // Find all items and throw if not found
    const items = await this.itemService.tryFindByIds(itemIds);

    // Verify ownership of all items in bulk
    await Promise.all(
      itemIds.map((itemId) =>
        this.itemService.verifyOwnership({
          id: itemId,
          userId: userId,
        }),
      ),
    );

    // Update tags for all items
    const updatedItems = items.map((item) => ({
      ...item,
      tags: [...new Set([...item.tags, ...tagIds])],
    }));

    // Save all items in parallel
    await Promise.all(updatedItems.map((item) => this.itemService.save(item)));
  }
}
