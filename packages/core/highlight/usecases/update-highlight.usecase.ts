import { HighlightService } from "@core/highlight/highlight.service.ts";
import type { Highlight } from "@core/highlight/highlight.entity.ts";
import { UpdateHighlightParams } from "@shared/types/params/mod.ts";

export class UpdateHighlightUseCase {
  constructor(private highlightService: HighlightService) {}

  execute(params: UpdateHighlightParams): Promise<Highlight> {
    return this.highlightService.update(
      {
        id: params.highlightId,
        userId: params.userId,
      },
      params.updates,
    );
  }
}
