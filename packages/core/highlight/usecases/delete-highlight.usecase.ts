import type { HighlightService } from "@core/highlight/highlight.service.ts";
import { DeleteHighlightParams } from "@shared/types/params/highlight.params.ts";

export class DeleteHighlightUseCase {
  constructor(private highlightService: HighlightService) {}

  async execute(params: DeleteHighlightParams): Promise<void> {
    await this.highlightService.delete({
      id: params.highlightId,
      userId: params.userId,
    });
  }
}
