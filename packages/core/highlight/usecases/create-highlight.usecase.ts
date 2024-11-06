import { type Highlight } from "@core/highlight/highlight.entity.ts";
import { CreateHighlightParams } from "@shared/types/params/highlight.params.ts";
import { HighlightService } from "@core/highlight/highlight.service.ts";

export class CreateHighlightUseCase {
  constructor(private highlightService: HighlightService) {}

  execute(params: CreateHighlightParams): Promise<Highlight> {
    return this.highlightService.create(params);
  }
}
