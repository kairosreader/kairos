import type { ListHighlightsParams } from "@kairos/shared/types";
import type { HighlightService } from "../highlight.service.ts";
import type { Highlight } from "../highlight.entity.ts";

export class ListHighlightsUseCase {
  constructor(private highlightService: HighlightService) {}

  execute(params: ListHighlightsParams): Promise<Highlight[]> {
    return this.highlightService.findByUser(params.userId);
  }
}
