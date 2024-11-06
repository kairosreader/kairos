import { TagService } from "../tag.service.ts";
import { BulkTagParams } from "@shared/types/params/tag.params.ts";

export class BulkTagUseCase {
  constructor(private tagService: TagService) {}

  async execute(params: BulkTagParams): Promise<void> {
    // Get or create all tags
    const tags = await this.tagService.getOrCreateMany(params);

    // Bulk add tags to articles
    await this.tagService.bulkAddToItem({
      itemIds: params.itemIds,
      userId: params.userId,
      tagInfos: tags.map((t) => ({ name: t.id })),
    });
  }
}
