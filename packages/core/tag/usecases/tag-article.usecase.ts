import { TagService } from "../tag.service.ts";
import { TagItemParams } from "@shared/types/params/tag.params.ts";

export class TagArticleUseCase {
  constructor(private tagService: TagService) {}

  async execute(params: TagItemParams): Promise<void> {
    // First get or create all tags
    await this.tagService.getOrCreateMany(params);

    // Then add tags to the article
    await this.tagService.addToItem(params);
  }
}
