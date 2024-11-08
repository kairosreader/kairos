import type { UserScopedRepository } from "../common/base.repository.ts";
import type { Highlight } from "./highlight.entity.ts";

export interface HighlightRepository extends UserScopedRepository<Highlight> {
  findByItem(itemId: string): Promise<Highlight[]>;
  findByItemAndUser(params: {
    itemId: string;
    userId: string;
  }): Promise<Highlight[]>;
}
