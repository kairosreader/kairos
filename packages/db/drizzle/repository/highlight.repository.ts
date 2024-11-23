import { and, eq, inArray, sql } from "drizzle-orm";
import { DrizzleUserScopedRepository } from "./user-scoped.repository.ts";
import type { Database } from "../../connection.ts";
import { highlights } from "../schema/highlight.ts";
import type { Highlight, HighlightRepository } from "@kairos/core/highlight";
import {
  type DatabaseResult,
  mapArrayNullToUndefined,
  mapNullToUndefined,
} from "../../utils.ts";
import type { FilterOperator } from "@kairos/shared/types/common";

export class DrizzleHighlightRepository extends DrizzleUserScopedRepository<
  Highlight,
  typeof highlights._.config,
  typeof highlights
> implements HighlightRepository {
  constructor(db: Database) {
    super(db, highlights);
  }

  protected override buildFilterCondition(
    field: string,
    operator: FilterOperator,
  ) {
    // If the given field is "text", return a custom filter condition for "textSelection".
    // We need this because "text" is just an abstraction in the API layer, and it doesn't
    // directly map to a column in the database.
    if (field === "text") {
      const entries = Object.entries(operator);
      if (entries.length === 0) return undefined;

      const [op, value] = entries[0];

      switch (op) {
        case "contains":
          return sql`jsonb_extract_path_text(text_selection, 'selectedText') ilike '%${value}%'`;
        case "startsWith":
          return sql`jsonb_extract_path_text(text_selection, 'selectedText') ilike '${value}%'`;
        case "endsWith":
          return sql`jsonb_extract_path_text(text_selection, 'selectedText') ilike '%${value}'`;
        default:
          return super.buildFilterCondition(field, operator);
      }
    }

    return super.buildFilterCondition(field, operator);
  }

  async findByItem(itemId: string, userId: string): Promise<Highlight[]> {
    const result = await this.db
      .select()
      .from(this.table)
      .where(and(eq(this.table.itemId, itemId), eq(this.table.userId, userId)));

    return mapArrayNullToUndefined<Highlight>(
      result as DatabaseResult<Highlight[]>,
    );
  }

  override async save(entity: Highlight): Promise<Highlight> {
    const [result] = await this.db
      .insert(this.table)
      .values(entity)
      .returning();

    return mapNullToUndefined<Highlight>(result as DatabaseResult<Highlight>);
  }

  override async saveMany(entities: Highlight[]): Promise<Highlight[]> {
    const result = await this.db
      .insert(this.table)
      .values(entities)
      .returning();

    return mapArrayNullToUndefined<Highlight>(
      result as DatabaseResult<Highlight[]>,
    );
  }

  override async update(
    id: string,
    updates: Partial<Highlight>,
  ): Promise<Highlight> {
    const [result] = await this.db
      .update(this.table)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(this.table.id, id))
      .returning();

    return mapNullToUndefined<Highlight>(result as DatabaseResult<Highlight>);
  }

  override async updateMany(
    ids: string[],
    updates: Partial<Highlight>,
  ): Promise<Highlight[]> {
    const result = await this.db
      .update(this.table)
      .set({ ...updates, updatedAt: new Date() })
      .where(inArray(this.table.id, ids))
      .returning();

    return mapArrayNullToUndefined<Highlight>(
      result as DatabaseResult<Highlight[]>,
    );
  }

  async deleteByItemId(itemId: string, userId: string): Promise<void> {
    await this.db
      .delete(this.table)
      .where(and(eq(this.table.itemId, itemId), eq(this.table.userId, userId)));
  }
}
