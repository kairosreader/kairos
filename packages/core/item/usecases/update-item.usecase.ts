import type { ItemContent, UpdateItemParams } from "@kairos/shared/types";
import type { ItemService } from "../item.service.ts";
import type { Item } from "../item.entity.ts";
import type { TagService } from "../../tag/tag.service.ts";

export class UpdateItemUseCase {
  constructor(
    private itemService: ItemService<ItemContent>,
    private tagService: TagService,
  ) {}

  async execute(params: UpdateItemParams): Promise<Item<ItemContent>> {
    // Verify tags exist for the user if updating tags
    if (params.updates.tags?.length) {
      await this.tagService.verifyOwnershipMany(
        params.updates.tags.map((tag) => ({
          id: tag.id,
          userId: params.userId,
        })),
      );
    }

    return this.itemService.update(params);
  }
}
