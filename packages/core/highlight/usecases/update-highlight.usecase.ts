import { HighlightService } from "@core/highlight/highlight.service.ts";
import type { Highlight } from "@core/highlight/highlight.entity.ts";
import { UpdateHighlightParams } from "@shared/types/params/highlight.params.ts";

export class UpdateHighlightUseCase {
  constructor(private highlightService: HighlightService) {}

  execute(params: UpdateHighlightParams): Promise<Highlight> {
    return this.highlightService.update(params);
  }
}
