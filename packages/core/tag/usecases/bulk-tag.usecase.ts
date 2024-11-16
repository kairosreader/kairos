import type { BulkTagItemOperation } from "@kairos/shared/types";
import type { TagService } from "../tag.service.ts";

export class BulkTagUseCase {
  constructor(private tagService: TagService) {}

  async execute(params: BulkTagItemOperation): Promise<void> {
    await this.tagService.bulkTagItems(params);
  }
}
