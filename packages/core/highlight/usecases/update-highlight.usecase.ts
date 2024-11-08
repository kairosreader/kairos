import type { UpdateHighlightParams } from "@kairos/shared/types";
import type { Highlight } from "../highlight.entity.ts";
import type { HighlightService } from "../highlight.service.ts";

export class UpdateHighlightUseCase {
  constructor(private highlightService: HighlightService) {}

  execute(params: UpdateHighlightParams): Promise<Highlight> {
    return this.highlightService.update(params);
  }
}
