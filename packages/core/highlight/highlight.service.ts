import type { CreateHighlightParams } from "@kairos/shared/types";
import { UserScopedService } from "../common/base.service.ts";
import type {
  Highlight,
  HighlightFilterableFields,
  HighlightSortableFields,
} from "./highlight.entity.ts";
import type { HighlightRepository } from "./highlight.repository.ts";
import { generateId } from "@kairos/shared/utils";
import { HIGHLIGHT_COLOR } from "@kairos/shared/constants";

export class HighlightService extends UserScopedService<
  Highlight,
  HighlightSortableFields,
  HighlightFilterableFields
> {
  protected override resourceName: string;
  constructor(private highlightRepo: HighlightRepository) {
    super(highlightRepo);
    this.resourceName = "Highlight";
  }

  create(params: CreateHighlightParams): Promise<Highlight> {
    const highlight: Highlight = {
      id: generateId(),
      itemId: params.data.itemId,
      userId: params.userId,
      color: params.data.color || HIGHLIGHT_COLOR.YELLOW,
      textSelection: params.data.textSelection,
      note: params.data.note,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.highlightRepo.save(highlight);
  }
}
