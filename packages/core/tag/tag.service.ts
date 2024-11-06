import { TagRepository } from "@core/tag/tag.repository.ts";
import { Tag } from "@core/tag/tag.entity.ts";
import {
  BaseError,
  BulkOperationError,
  OperationError,
} from "@shared/types/errors/mod.ts";
import {
  BulkTagParams,
  CreateManyTagsParams,
  CreateTagParams,
  FindTagByNameParams,
  TagItemParams,
} from "@shared/types/params/mod.ts";
import { ItemService } from "@core/item/item.service.ts";
import { ItemContent } from "@shared/types/common/mod.ts";
import { generateId } from "@shared/utils/mod.ts";
import { UserScopedService } from "@core/common/base.service.ts";

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
    const { userId, tagInfo } = params;

    // Check if the tag already exists for the user
    let tag = await this.tagRepo.findByName({
      tagName: params.tagInfo.name,
      userId,
    });
    if (!tag) {
      // Create a new tag if it doesn't
      tag = {
        id: generateId(),
        userId: userId,
        name: tagInfo.name,
        color: tagInfo.color,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await this.tagRepo.save(tag);
    }
    return tag;
  }

  getOrCreateMany(params: CreateManyTagsParams): Promise<Tag[]> {
    const { userId, tagInfos } = params;

    return Promise.all(
      tagInfos.map((tagInfo) => this.getOrCreate({ userId: userId, tagInfo })),
    );
  }

  async addToItem(params: TagItemParams): Promise<void> {
    const item = await this.itemService.tryFindById(params.itemId);
    const newTags = params.tagInfos.map((t) => t.name);

    item.tags = [...new Set([...item.tags, ...newTags])];
    await this.itemService.save(item);
  }

  async bulkAddToItem(params: BulkTagParams): Promise<void> {
    const errors: BaseError[] = [];

    await Promise.all(
      params.itemIds.map(async (itemId) => {
        try {
          await this.addToItem({
            itemId: itemId,
            ...params,
          });
        } catch (error) {
          if (error instanceof BaseError) {
            errors.push(error);
          } else {
            errors.push(new OperationError(`Unknown error`, error));
          }
        }
      }),
    );

    if (errors.length > 0) {
      throw new BulkOperationError(`Failed to tag some items`, errors);
    }
  }
}
