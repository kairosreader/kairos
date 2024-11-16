import type { ItemContent, MergeTagsOperation } from "@kairos/shared/types";
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
    const count = await this.itemService.count(params.userId, {
      tags: {
        in: [sourceTag.id],
      },
    });

    const paginatedItems = await this.itemService.findByUser(params.userId, {
      pagination: {
        type: "offset",
        page: 1,
        limit: count,
      },
      filter: {
        tags: {
          in: [sourceTag.id],
        },
      },
    });

    // Replace source tag with target tag
    await Promise.all(
      paginatedItems.items.map((item) => {
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
