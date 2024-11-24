import type { GetParams } from "@kairos/shared/types";
import type { HighlightService } from "../highlight.service.ts";
import type { Highlight } from "../highlight.entity.ts";

export class GetHighlightUseCase {
  constructor(private highlightService: HighlightService) {}

  async execute(params: GetParams): Promise<Highlight> {
    const highlight = await this.highlightService.tryFindById(params);

    // Verify ownership
    await this.highlightService.verifyOwnership(params);

    return highlight;
  }
}
