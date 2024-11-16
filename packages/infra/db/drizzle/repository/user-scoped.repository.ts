import { and, eq } from "drizzle-orm";
import type { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";
import type {
  BaseEntity,
  FilterOptions,
  OffsetPagination,
  QueryOptions,
} from "@kairos/shared/types/common";
import { DrizzleBaseRepository } from "./base.repository.ts";
import type { ResourceIdentifier } from "@kairos/shared/types/params";

export abstract class DrizzleUserScopedRepository<
  E extends BaseEntity,
  T extends TableConfig,
  TTable extends PgTableWithColumns<T>,
  TSortable extends string = string,
  TFilterable extends string = string,
> extends DrizzleBaseRepository<E, T, TTable, TSortable, TFilterable> {
  findByUser(userId: string, options?: QueryOptions<TSortable, TFilterable>) {
    const userFilter = { userId: { eq: userId } } as FilterOptions<TFilterable>;
    const filter = options?.filter
      ? { ...options.filter, ...userFilter }
      : undefined;

    const pagination = options?.pagination
      ? options.pagination
      : ({
          type: "offset",
          page: 1,
          limit: 20,
        } as OffsetPagination);

    return this.find({
      pagination: pagination,
      sort: options?.sort,
      filter: filter,
    });
  }

  async delete({ id, userId }: ResourceIdentifier): Promise<void> {
    await this.db
      .delete(this.table)
      .where(and(eq(this.table.id, id), eq(this.table.userId, userId)));
  }
}
