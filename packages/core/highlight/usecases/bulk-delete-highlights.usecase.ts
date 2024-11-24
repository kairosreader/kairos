import type { BulkDeleteParams } from "@kairos/shared/types";
import type { HighlightService } from "../highlight.service.ts";

export class BulkDeleteHighlightsUseCase {
  constructor(private highlightService: HighlightService) {}

  async execute({ ids, userId }: BulkDeleteParams): Promise<void> {
    await this.highlightService.bulkDelete(
      ids.map((id) => ({ id, userId: userId })),
    );
  }
}
