import type {
  ItemContent,
  ItemTag,
  MergeTagsOperation,
} from "@kairos/shared/types";
import {
  TagNotFoundError,
  UnauthorizedError,
} from "@kairos/shared/types/errors";
import type { ItemService } from "../../item/item.service.ts";
import type { TagService } from "../tag.service.ts";

export class MergeTagsUseCase {
  constructor(
    private tagService: TagService,
    private itemService: ItemService<ItemContent>,
  ) {}

  async execute(params: MergeTagsOperation): Promise<void> {
    // Check if source and target tags exist
    const [sourceTag, targetTag] = await Promise.all([
      this.tagService.findById({
        id: params.sourceTagId,
        userId: params.userId,
      }),
      this.tagService.findById({
        id: params.targetTagId,
        userId: params.userId,
      }),
    ]);

    // Check if source and target tags exist and belong to the user
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
    const items = await this.itemService.findByUserAndTag(
      params.userId,
      sourceTag.id,
    );

    if (items.length > 0) {
      // Create ItemTag format for target tag
      const targetItemTag: ItemTag = {
        id: targetTag.id,
        name: targetTag.name,
        color: targetTag.color,
      };

      // Replace source tag with target tag for all items
      await this.itemService.bulkReplaceTags(
        items.map((item) => item.id),
        [targetItemTag],
      );
    }

    // Delete the source tag
    await this.tagService.delete({
      id: sourceTag.id,
      userId: params.userId,
    });
  }
}
