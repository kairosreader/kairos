import { TagService } from "@core/tag/tag.service.ts";
import type { Tag } from "@core/tag/tag.entity.ts";
import { CreateTagParams } from "@shared/types/params/mod.ts";

export class CreateTagUseCase {
  constructor(private tagService: TagService) {}

  execute(params: CreateTagParams): Promise<Tag> {
    return this.tagService.getOrCreate(params);
  }
}
