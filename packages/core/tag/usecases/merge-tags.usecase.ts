import {
  TagNotFoundError,
  UnauthorizedError,
} from "@shared/types/errors/mod.ts";
import { MergeTagsParams } from "@shared/types/params/tag.params.ts";
import { TagService } from "@core/tag/tag.service.ts";
import { ItemService } from "@core/item/item.service.ts";
import { ItemContent } from "@shared/types/common/mod.ts";

export class MergeTagsUseCase {
  constructor(
    private tagService: TagService,
    private itemService: ItemService<ItemContent>,
  ) {}

  async execute(params: MergeTagsParams): Promise<void> {
    // Check if source and target tags exist
    const [sourceTag, targetTag] = await Promise.all([
      this.tagService.findByName({
        userId: params.userId,
        tagName: params.sourceTagId,
      }),
      this.tagService.findByName({
        userId: params.userId,
        tagName: params.targetTagId,
      }),
    ]);

    // Check if source and target tags belong to the same user
    if (!sourceTag) {
      throw new TagNotFoundError(params.sourceTagId);
    }

    if (!targetTag) {
      throw new TagNotFoundError(params.targetTagId);
    }

    if (
      sourceTag.userId !== params.userId ||
      targetTag.userId !== params.userId
    ) {
      throw UnauthorizedError;
    }

    // Get all items with source tag
    const items = await this.itemService.findByUser(params.userId);
    const itemsWithSourceTag = items.filter((item) =>
      item.tags.includes(sourceTag.name)
    );

    // Replace source tag with target tag
    await Promise.all(
      itemsWithSourceTag.map((item) => {
        const updatedTags = item.tags
          .filter((id) => id !== sourceTag.name)
          .concat(targetTag.name);

        item.tags = [...new Set(updatedTags)]; // Remove duplicates
        return this.itemService.save(item);
      }),
    );

    // Delete the source tag
    await this.tagService.delete({
      id: params.sourceTagId,
      userId: params.userId,
    });
  }
}
