import { ItemService } from "@core/item/item.service.ts";
import { ItemContent } from "@shared/types/mod.ts";
import { ReadingProgress } from "@core/item/item.entity.ts";
import { UpdateReadingProgressParams } from "@shared/types/params/mod.ts";

export class UpdateReadingProgressUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  async execute(params: UpdateReadingProgressParams): Promise<void> {
    // First verify item exists and user owns it
    await this.itemService.verifyOwnership(params);

    const progress: ReadingProgress = {
      itemId: params.id,
      userId: params.userId,
      progress: params.progress,
      lastPosition: params.lastPosition,
      lastReadAt: new Date(),
    };

    // Use the repository to update reading progress
    await this.itemService["itemRepo"].updateReadingProgress(progress);
  }
}
