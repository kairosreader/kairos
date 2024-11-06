import type { HighlightRepository } from "@core/highlight/highlight.repository.ts";
import { HighlightNotFoundError } from "@shared/types/errors/mod.ts";
import { generateId, HIGHLIGHT_COLOR } from "@shared/mod.ts";
import { type Highlight } from "@core/highlight/highlight.entity.ts";
import {
  CreateHighlightParams,
  UpdateHighlightParams,
} from "@shared/types/params/highlight.params.ts";
import { UserScopedService } from "@core/common/base.service.ts";

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

  async update(params: UpdateHighlightParams): Promise<Highlight> {
    // Check if highlight exists
    const highlight = await this.highlightRepo.findById(params.highlightId);
    if (!highlight) {
      throw new HighlightNotFoundError(params.highlightId);
    }

    // Verify ownership
    await this.verifyOwnership({
      id: params.highlightId,
      userId: params.userId,
    });

    const updatedHighlight: Highlight = {
      ...highlight!,
      ...params.updates,
      updatedAt: new Date(),
    };

    return this.highlightRepo.update(params.highlightId, updatedHighlight);
  }
}
