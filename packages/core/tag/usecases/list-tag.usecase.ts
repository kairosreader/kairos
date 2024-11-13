import type { ListTagsParams } from "@kairos/shared/types";
import type { TagService } from "../tag.service.ts";
import type { Tag } from "../tag.entity.ts";

export class ListTagsUseCase {
  constructor(private tagService: TagService) {}

  execute(params: ListTagsParams): Promise<Tag[]> {
    return this.tagService.findByUser(params.userId);
  }
}
