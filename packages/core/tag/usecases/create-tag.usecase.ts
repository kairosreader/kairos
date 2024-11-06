import { TagService } from "@core/tag/tag.service.ts";
import type { Tag } from "../tag.entity.ts";
import { CreateTagParams } from "@shared/types/params/tag.params.ts";

export class CreateTagUseCase {
  constructor(private tagService: TagService) {}

  execute(params: CreateTagParams): Promise<Tag> {
    return this.tagService.getOrCreate(params);
  }
}
