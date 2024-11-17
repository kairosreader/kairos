import type { PaginatedResponse, QueryOptions } from "@kairos/shared/types";
import type { TagService } from "../tag.service.ts";
import type {
  Tag,
  TagFilterableFields,
  TagSortableFields,
} from "../tag.entity.ts";

export interface ListTagsParams {
  userId: string;
  options?: QueryOptions<TagSortableFields, TagFilterableFields>;
}

export class ListTagsUseCase {
  constructor(private tagService: TagService) {}

  execute(params: ListTagsParams): Promise<PaginatedResponse<Tag>> {
    return this.tagService.findByUser(params.userId, params.options);
  }
}
