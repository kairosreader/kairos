import type { CreateTagParams } from "@kairos/shared/types";
import type { TagService } from "../tag.service.ts";
import type { Tag } from "../tag.entity.ts";

export class CreateTagUseCase {
  constructor(private tagService: TagService) {}

  execute(params: CreateTagParams): Promise<Tag> {
    return this.tagService.getOrCreate(params);
  }
}
