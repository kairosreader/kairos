import type { ItemContent } from "@kairos/shared/types/common";
import type {
  BulkTagItemOperation,
  CreateManyTagsOperation,
  CreateTagParams,
  FindTagByNameParams,
  ResourceIdentifier,
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
      // Create a new tag if it doesn't exist
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

  async getOrCreateMany(params: CreateManyTagsOperation): Promise<Tag[]> {
    const { userId, tagInfos } = params;

    // Check if the tags already exist for the user
    const tagNames = tagInfos.map((tag) => tag.name);
    const existingTags = await this.tagRepo.findByNames({
      userId,
      tagNames,
    });

    // Create tags that don't exist
    const tagsToCreate = tagInfos.filter(
      (tag) =>
        !existingTags.some((existingTag) => existingTag.name === tag.name),
    );

    if (tagsToCreate.length > 0) {
      const createdTags = await this.createMany({
        userId,
        tagInfos: tagsToCreate,
      });

      // Return all tags
      return [...existingTags, ...createdTags];
    }

    // Return existing tags
    return existingTags;
  }

  async tagItem(params: TagItemOperation): Promise<void> {
    const { userId, itemId, tagInfos } = params;

    // Check if item exists
    await this.itemService.tryFindById({
      id: itemId,
      userId,
    });

    // Get or create the tag
    const tags = await this.getOrCreateMany({
      userId,
      tagInfos,
    });

    const tagIds = tags.map((tag) => tag.id);

    // Update item tags
    await this.itemService.update({
      id: itemId,
      userId,
      updates: {
        tags: tagIds,
      },
    });
  }

  async untagItem(params: TagItemOperation): Promise<void> {
    const { userId, itemId, tagInfos } = params;

    // Check if item exists
    const item = await this.itemService.tryFindById({
      id: itemId,
      userId,
    });

    // Find the tags to remove
    const tags = await this.tagRepo.findByNames({
      userId,
      tagNames: tagInfos.map((tag) => tag.name),
    });
    const tagIds = tags.map((tag) => tag.id);

    // Remove tag from item
    const updatedTags = item.tags.filter((tagId) => !tagIds.includes(tagId));
    await this.itemService.update({
      id: itemId,
      userId,
      updates: {
        tags: updatedTags,
      },
    });
  }

  async bulkTagItems(params: BulkTagItemOperation): Promise<void> {
    const { userId, itemIds, tagInfos } = params;

    // Check if items exists
    await this.itemService.tryFindByIds(itemIds);

    // Get or create the tags
    const tags = await this.getOrCreateMany({
      userId,
      tagInfos,
    });

    const tagIds = tags.map((tag) => tag.id);

    // Update item tags
    await this.itemService.updateMany({
      userId,
      ids: itemIds,
      updates: {
        tags: tagIds,
      },
    });
  }

  createMany(params: CreateManyTagsOperation): Promise<Tag[]> {
    const { userId, tagInfos } = params;

    const tags = tagInfos.map((tagInfo) => ({
      id: generateId(),
      userId,
      name: tagInfo.name,
      color: tagInfo.color,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return this.tagRepo.saveMany(tags);
  }

  override async delete(params: ResourceIdentifier): Promise<void> {
    const { id: tagId, userId } = params;

    // Verify tag ownership
    await this.verifyOwnership({
      id: tagId,
      userId,
    });

    // Find all items with this tag
    const itemIds = await this.findItemsByTag(userId, tagId);

    if (itemIds.length > 0) {
      // Update all items to remove this tag
      await this.itemService.removeTagsFromItems(itemIds, [tagId]);
    }

    // Now delete the tag
    await super.delete(params);
  }

  private async findItemsByTag(
    userId: string,
    tagId: string,
  ): Promise<string[]> {
    const items = await this.itemService.findByUserAndTag(userId, tagId);
    return items.map((item) => item.id);
  }
}
