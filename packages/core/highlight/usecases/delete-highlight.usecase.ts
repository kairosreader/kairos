import type { DeleteParams } from "@kairos/shared/types";
import type { HighlightService } from "../highlight.service.ts";

export class DeleteHighlightUseCase {
  constructor(private highlightService: HighlightService) {}

  async execute(params: DeleteParams): Promise<void> {
    await this.highlightService.delete(params);
  }
}
