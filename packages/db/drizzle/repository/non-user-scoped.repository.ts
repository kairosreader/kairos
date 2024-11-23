import { eq, sql } from "drizzle-orm";
import type { NonUserScopedRepository } from "@kairos/core";
import type { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";
import type { BaseEntity, FilterConfig } from "@kairos/shared/types/common";
import { DrizzleBaseRepository } from "./base.repository.ts";
import { type DatabaseResult, mapNullToUndefined } from "../../utils.ts";

export abstract class DrizzleNonUserScopedRepository<
  E extends BaseEntity,
  T extends TableConfig,
  TTable extends PgTableWithColumns<T>,
  TSortable extends string = string,
  TFilterable extends string = string,
> extends DrizzleBaseRepository<E, T, TTable, TSortable, TFilterable>
  implements NonUserScopedRepository<E, TSortable, TFilterable> {
  async findById(id: string): Promise<E | null> {
    const [item] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);

    return mapNullToUndefined<E>(item as DatabaseResult<E>) || null;
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(this.table).where(eq(this.table.id, id));
  }

  async count(filter?: FilterConfig<TFilterable>): Promise<number> {
    const whereClause = this.buildWhereClause(filter);

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table)
      .where(whereClause);

    return Number(count);
  }
}
