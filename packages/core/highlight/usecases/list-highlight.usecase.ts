import type { PaginatedResponse, QueryOptions } from "@kairos/shared/types";
import type { HighlightService } from "../highlight.service.ts";
import type {
  Highlight,
  HighlightFilterableFields,
  HighlightSortableFields,
} from "../highlight.entity.ts";

export interface ListHighlightsParams {
  userId: string;
  options?: QueryOptions<HighlightSortableFields, HighlightFilterableFields>;
}

export class ListHighlightsUseCase {
  constructor(private highlightService: HighlightService) {}

  execute(params: ListHighlightsParams): Promise<PaginatedResponse<Highlight>> {
    return this.highlightService.findByUser(params.userId, params.options);
  }
}
