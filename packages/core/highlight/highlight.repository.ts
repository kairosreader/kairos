import type { Highlight } from "@core/highlight/highlight.entity.ts";
import { UserScopedRepository } from "@core/common/base.repository.ts";

export interface HighlightRepository extends UserScopedRepository<Highlight> {
  findByItem(itemId: string): Promise<Highlight[]>;
  findByItemAndUser(params: {
    itemId: string;
    userId: string;
  }): Promise<Highlight[]>;
}
