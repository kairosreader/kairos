import type { HighlightService } from "@core/highlight/highlight.service.ts";
import { BulkDeleteHighlightsParams } from "@shared/types/params/mod.ts";

export class BulkDeleteHighlightsUseCase {
  constructor(private highlightService: HighlightService) {}

  async execute(params: BulkDeleteHighlightsParams): Promise<void> {
    await this.highlightService.bulkDelete(
      params.highlightIds.map((id) => ({ id, userId: params.userId })),
    );
  }
}
