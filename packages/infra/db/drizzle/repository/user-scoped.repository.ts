import { and, eq, sql } from "drizzle-orm";
import type { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";
import type {
  BaseEntity,
  FilterOptions,
  OffsetPagination,
  PaginatedResponse,
  QueryOptions,
} from "@kairos/shared/types/common";
import { DrizzleBaseRepository } from "./base.repository.ts";
import type { ResourceIdentifier } from "@kairos/shared/types/params";
import type { UserScopedRepository } from "@kairos/core";

export abstract class DrizzleUserScopedRepository<
  E extends BaseEntity,
  T extends TableConfig,
  TTable extends PgTableWithColumns<T>,
  TSortable extends string = string,
  TFilterable extends string = string,
> extends DrizzleBaseRepository<E, T, TTable, TSortable, TFilterable>
  implements UserScopedRepository<E, TSortable, TFilterable> {
  findByUser(
    userId: string,
    options?: QueryOptions<TSortable, TFilterable>,
  ): Promise<PaginatedResponse<E>> {
    const userFilter = { userId: { eq: userId } } as FilterOptions<TFilterable>;
    const filter = options?.filter
      ? { ...options.filter, ...userFilter }
      : undefined;

    const pagination = options?.pagination ? options.pagination : ({
      type: "offset",
      page: 1,
      limit: 20,
    } as OffsetPagination);

    return this.find({
      pagination: pagination,
      sort: options?.sort,
      filter,
    });
  }

  async delete({ id, userId }: ResourceIdentifier): Promise<void> {
    await this.db
      .delete(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.userId, userId)));
  }

  async count(
    userId: string,
    filter?: FilterOptions<TFilterable>,
  ): Promise<number> {
    const whereClause = this.buildWhereClause(filter);
    const where = and(whereClause, eq(this.table.userId, userId));

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table)
      .where(where);

    return Number(count);
  }
}
