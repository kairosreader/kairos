import { TagService } from "@core/tag/tag.service.ts";
import { TagItemParams } from "@shared/types/params/mod.ts";

export class TagItemUseCase {
  constructor(private tagService: TagService) {}

  async execute(params: TagItemParams): Promise<void> {
    // First get or create all tags
    await this.tagService.getOrCreateMany(params);

    // Then add tags to the article
    await this.tagService.addToItem(params);
  }
}
