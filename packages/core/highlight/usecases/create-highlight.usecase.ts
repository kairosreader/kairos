import type { CreateHighlightParams } from "@kairos/shared/types";
import type { HighlightService } from "../highlight.service.ts";
import type { Highlight } from "../highlight.entity.ts";

export class CreateHighlightUseCase {
  constructor(private highlightService: HighlightService) {}

  execute(params: CreateHighlightParams): Promise<Highlight> {
    return this.highlightService.create(params);
  }
}
