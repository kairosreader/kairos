import type { UserScopedRepository } from "../common/base.repository.ts";
import type {
  Highlight,
  HighlightFilterableFields,
  HighlightSortableFields,
} from "./highlight.entity.ts";

export interface HighlightRepository extends
  UserScopedRepository<
    Highlight,
    HighlightSortableFields,
    HighlightFilterableFields
  > {
  findByItem(itemId: string, userId: string): Promise<Highlight[]>;
  deleteByItemId(itemId: string, userId: string): Promise<void>;
}
