import type { HighlightService } from "@core/highlight/highlight.service.ts";
import { DeleteParams } from "@shared/types/params/mod.ts";

export class DeleteHighlightUseCase {
  constructor(private highlightService: HighlightService) {}

  async execute(params: DeleteParams): Promise<void> {
    await this.highlightService.delete(params);
  }
}
