import type { GetParams } from "@kairos/shared";
import type { TagService } from "../tag.service.ts";
import type { Tag } from "../tag.entity.ts";

export class GetTagUseCase {
  constructor(private tagService: TagService) {}

  async execute(params: GetParams): Promise<Tag> {
    const tag = await this.tagService.tryFindById(params.id);

    // Verify ownership
    await this.tagService.verifyOwnership(params);

    return tag;
  }
}
