import type { BulkDeleteHighlightsOperation } from "@kairos/shared/types";
import type { HighlightService } from "../highlight.service.ts";

export class BulkDeleteHighlightsUseCase {
  constructor(private highlightService: HighlightService) {}

  async execute(params: BulkDeleteHighlightsOperation): Promise<void> {
    await this.highlightService.bulkDelete(
      params.highlightIds.map((id) => ({ id, userId: params.userId })),
    );
  }
}
