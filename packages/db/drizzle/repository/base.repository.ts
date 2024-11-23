import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  lt,
  lte,
  ne,
  notInArray,
  type SQL,
  sql,
} from "drizzle-orm";
import type {
  PgColumn,
  PgTableWithColumns,
  TableConfig,
} from "drizzle-orm/pg-core";
import type {
  BaseEntity,
  FilterConfig,
  FilterFieldConfig,
  FilterOperator,
  PaginatedResponse,
  PaginationOptions,
  QueryOptions,
  SortDirection,
} from "@kairos/shared/types/common";
import type { Database } from "../../connection.ts";
import {
  type DatabaseResult,
  mapArrayNullToUndefined,
  mapNullToUndefined,
} from "../../utils.ts";
import type { BaseRepository } from "@kairos/core";
import { toSnakeCase } from "@kairos/shared/utils";

type OperatorFunction = {
  <TColumn extends PgColumn>(
    column: TColumn,
    value: TColumn["_"]["data"] | SQL | unknown[],
  ): SQL;
};

const filterOperatorMap: Record<FilterOperator, OperatorFunction> = {
  eq: eq,
  neq: ne,
  gt: gt,
  gte: gte,
  lt: lt,
  lte: lte,
  in: inArray,
  nin: notInArray,
  contains: (column, value) => ilike(column, `%${value}%`),
  startsWith: (column, value) => ilike(column, `${value}%`),
  endsWith: (column, value) => ilike(column, `%${value}`),
};

export abstract class DrizzleBaseRepository<
  E extends BaseEntity,
  T extends TableConfig,
  TTable extends PgTableWithColumns<T>,
  TSortable extends string = string,
  TFilterable extends string = string,
> implements BaseRepository<E, TSortable, TFilterable> {
  constructor(
    protected readonly db: Database,
    protected readonly table: TTable,
  ) {}

  protected buildFilterCondition(
    field: TFilterable,
    operators: FilterFieldConfig,
  ): SQL | undefined {
    const column = this.table[toSnakeCase(field) as keyof TTable];
    if (!column) return undefined;

    const conditions = Object.entries(operators)
      .map(([op, value]) => {
        const operatorFn = filterOperatorMap[op as FilterOperator];
        return operatorFn ? operatorFn(column, value) : undefined;
      })
      .filter(
        (condition): condition is NonNullable<typeof condition> =>
          condition !== undefined,
      );

    return conditions.length === 1
      ? conditions[0]
      : conditions.length > 1
      ? and(...conditions)
      : undefined;
  }

  protected buildWhereClause(filter?: FilterConfig<TFilterable>) {
    if (!filter) return undefined;

    const conditions = Object.entries(filter)
      .map(([field, operators]) =>
        this.buildFilterCondition(field as TFilterable, operators || {})
      )
      .filter(
        (condition): condition is NonNullable<typeof condition> =>
          condition !== undefined,
      );

    return conditions.length === 1
      ? conditions[0]
      : conditions.length > 1
      ? and(...conditions)
      : undefined;
  }

  protected buildOrderBy(
    sort?: { field: TSortable; direction: SortDirection }[],
  ) {
    if (!sort || sort.length === 0) {
      return [this.table.id];
    }

    return sort.map(({ field, direction }) => {
      const column = this.table[toSnakeCase(field) as keyof TTable];
      return direction === "desc" ? desc(column) : asc(column);
    });
  }

  protected buildPaginationQuery(
    pagination: PaginationOptions,
    whereClause?: ReturnType<typeof this.buildWhereClause>,
  ) {
    if (pagination.type === "offset") {
      return {
        limit: pagination.pageSize,
        offset: (pagination.page - 1) * pagination.pageSize,
      };
    }

    const limit = pagination.pageSize;
    if (!pagination.cursor) {
      return { limit, offset: 0 };
    }

    const decodedCursor = JSON.parse(atob(pagination.cursor));
    const cursorColumn = this.table.id;
    const cursorCondition = gt(cursorColumn, decodedCursor.id);

    return {
      limit,
      offset: 0,
      where: whereClause ? and(whereClause, cursorCondition) : cursorCondition,
    };
  }

  protected encodeCursor(item: E): string {
    return btoa(JSON.stringify({ id: item.id }));
  }

  async find(
    options: QueryOptions<TSortable, TFilterable>,
  ): Promise<PaginatedResponse<E>> {
    const whereClause = this.buildWhereClause(options.filters);
    const orderBy = this.buildOrderBy(options.sort);
    const { limit, offset, where } = this.buildPaginationQuery(
      options.pagination,
      whereClause,
    );

    const finalWhereClause = where || whereClause;

    const query = this.db
      .select()
      .from(this.table)
      .where(finalWhereClause)
      .orderBy(...orderBy)
      .limit(limit + 1) // Get one extra item to determine if there's a next page
      .offset(offset);

    const items = (await query) as E[];

    const hasNextPage = items.length > limit;
    if (hasNextPage) {
      items.pop(); // Remove the extra item
    }

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table)
      .where(whereClause);

    const hasPreviousPage = options.pagination.type === "offset"
      ? options.pagination.page > 1
      : Boolean(options.pagination.cursor);

    return {
      items,
      pageInfo: {
        hasNextPage,
        hasPreviousPage,
        totalCount: Number(count),
        cursor: hasNextPage
          ? this.encodeCursor(items[items.length - 1])
          : undefined,
      },
    };
  }

  async findByIds(ids: string[]): Promise<E[]> {
    const query = await this.db
      .select()
      .from(this.table)
      .where(inArray(this.table.id, ids));

    return mapArrayNullToUndefined<E>(query as DatabaseResult<E>[]);
  }

  async findOne(filter: FilterConfig<TFilterable>): Promise<E | null> {
    const whereClause = this.buildWhereClause(filter);
    if (!whereClause) return null;

    const [item] = await this.db
      .select()
      .from(this.table)
      .where(whereClause)
      .limit(1);

    if (!item) return null;

    return mapNullToUndefined<E>(item as DatabaseResult<E>);
  }

  abstract save(entity: E): Promise<E>;
  abstract saveMany(entities: E[]): Promise<E[]>;
  abstract update(id: string, updates: Partial<E>): Promise<E>;
  abstract updateMany(ids: string[], updates: Partial<E>): Promise<E[]>;
}
