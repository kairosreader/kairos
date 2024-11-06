import type { HighlightRepository } from "@core/highlight/highlight.repository.ts";
import { type Highlight } from "@core/highlight/highlight.entity.ts";
import { CreateHighlightParams } from "@shared/types/params/mod.ts";
import { UserScopedService } from "@core/common/base.service.ts";
import { generateId } from "@shared/utils/mod.ts";
import { HIGHLIGHT_COLOR } from "@shared/constants/mod.ts";

export class HighlightService extends UserScopedService<Highlight> {
  protected override resourceName: string;
  constructor(private highlightRepo: HighlightRepository) {
    super(highlightRepo);
    this.resourceName = "Highlight";
  }

  create(params: CreateHighlightParams): Promise<Highlight> {
    const highlight: Highlight = {
      id: generateId(),
      itemInfo: params.itemInfo,
      userId: params.userId,
      color: params.color || HIGHLIGHT_COLOR.YELLOW,
      textSelection: params.textSelection,
      note: params.note,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.highlightRepo.save(highlight);
  }
}
