import type { TagItemOperation } from "@kairos/shared/types";
import type { TagService } from "../tag.service.ts";

export class TagItemUseCase {
  constructor(private tagService: TagService) {}

  async execute(params: TagItemOperation): Promise<void> {
    await this.tagService.addToItem(params);
  }
}
