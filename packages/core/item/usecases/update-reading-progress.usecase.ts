import type {
  ItemContent,
  UpdateReadingProgressParams,
} from "@kairos/shared/types";
import type { ItemService } from "../item.service.ts";
import type { ReadingProgress } from "../item.entity.ts";

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

    await this.itemService.updateReadingProgress(params.id, progress);
  }
}
