import type { HighlightService } from "@core/highlight/highlight.service.ts";
import { BulkDeleteHighlightsParams } from "@shared/types/params/highlight.params.ts";

export class BulkDeleteHighlightsUseCase {
  constructor(private highlightService: HighlightService) {}

  async execute(params: BulkDeleteHighlightsParams): Promise<void> {
    await this.highlightService.bulkDeleteHighlights(params);
  }
}
