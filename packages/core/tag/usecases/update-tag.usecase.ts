import type { UpdateTagParams } from "@kairos/shared/types";
import type { TagService } from "../tag.service.ts";
import type { Tag } from "../tag.entity.ts";

export class UpdateTagUseCase {
  constructor(private tagService: TagService) {}

  execute(params: UpdateTagParams): Promise<Tag> {
    return this.tagService.update(params);
  }
}
