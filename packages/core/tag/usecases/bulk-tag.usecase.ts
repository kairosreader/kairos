import { TagService } from "@core/tag/tag.service.ts";
import { BulkTagItemOperation } from "@shared/types/mod.ts";

export class BulkTagUseCase {
  constructor(private tagService: TagService) {}

  async execute(params: BulkTagItemOperation): Promise<void> {
    await this.tagService.bulkAddToItem(params);
  }
}
