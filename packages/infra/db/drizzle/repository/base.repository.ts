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
  sql,
} from "drizzle-orm";
import type { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";
import type {
  BaseEntity,
  FilterOperator,
  FilterOptions,
  PaginatedResponse,
  PaginationOptions,
  QueryOptions,
  SortOptions,
} from "@kairos/shared/types/common";
import type { BaseRepository } from "@kairos/core";
import type { Database } from "../../connection.ts";
import {
  mapArrayNullToUndefined,
  mapNullToUndefined,
  type DatabaseResult,
} from "../../utils.ts";

export abstract class DrizzleBaseRepository<
  E extends BaseEntity,
  T extends TableConfig,
  TTable extends PgTableWithColumns<T>,
  TSortable extends string = string,
  TFilterable extends string = string,
> implements BaseRepository<E>
{
  constructor(
    protected readonly db: Database,
    protected readonly table: TTable,
  ) {}
  protected buildFilterCondition(field: string, operator: FilterOperator) {
    const column = this.table[field as keyof TTable];
    if (!column) return undefined;

    const entries = Object.entries(operator);
    if (entries.length === 0) return undefined;

    const [op, value] = entries[0];

    switch (op) {
      case "eq":
        return eq(column, value);
      case "neq":
        return ne(column, value);
      case "gt":
        return gt(column, value);
      case "gte":
        return gte(column, value);
      case "lt":
        return lt(column, value);
      case "lte":
        return lte(column, value);
      case "in":
        return inArray(column, value);
      case "nin":
        return notInArray(column, value);
      case "contains":
        return ilike(column, `%${value}%`);
      case "startsWith":
        return ilike(column, `${value}%`);
      case "endsWith":
        return ilike(column, `%${value}`);
      default:
        return undefined;
    }
  }

  protected buildWhereClause(filter?: FilterOptions<TFilterable>) {
    if (!filter) return undefined;

    const conditions = Object.entries(filter)
      .map(([field, operator]) =>
        this.buildFilterCondition(field, operator as FilterOperator),
      )
      .filter(
        (condition): condition is NonNullable<typeof condition> =>
          condition !== undefined,
      );

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  protected buildOrderBy(sort?: SortOptions<TSortable>) {
    // Default to createdAt
    const defaultSort = desc(this.table.createdAt);
    if (!sort) return defaultSort;

    const column = this.table[sort.field as keyof TTable];
    if (!column) return defaultSort;

    return sort.direction === "asc" ? asc(column) : desc(column);
  }

  protected buildPaginationQuery(
    pagination: PaginationOptions,
    whereClause?: ReturnType<typeof this.buildWhereClause>,
  ) {
    if (pagination.type === "offset") {
      return {
        limit: pagination.limit,
        offset: (pagination.page - 1) * pagination.limit,
      };
    }

    const limit = pagination.limit;
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
    const whereClause = this.buildWhereClause(options.filter);
    const orderBy = this.buildOrderBy(options.sort);
    const { limit, offset, where } = this.buildPaginationQuery(
      options.pagination,
      whereClause,
    );

    const finalWhereClause = where || whereClause;

    // Get one extra item to determine if there's a next page
    const items = (await this.db
      .select()
      .from(this.table)
      .where(finalWhereClause)
      .orderBy(orderBy)
      .limit(limit + 1)
      .offset(offset)) as E[];

    const hasNextPage = items.length > limit;
    if (hasNextPage) {
      items.pop(); // Remove the extra item
    }

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table)
      .where(whereClause);

    const hasPreviousPage =
      options.pagination.type === "offset"
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

  async findById(id: string): Promise<E | null> {
    const [item] = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id))
      .limit(1);

    return mapNullToUndefined<E>(item as DatabaseResult<E>) || null;
  }

  async findByIds(ids: string[]): Promise<E[]> {
    const query = await this.db
      .select()
      .from(this.table)
      .where(inArray(this.table.id, ids));

    return mapArrayNullToUndefined<E>(query as DatabaseResult<E>[]);
  }

  async findOne(filter: FilterOptions<TFilterable>): Promise<E | null> {
    const whereClause = this.buildWhereClause(filter);
    if (!whereClause) return null;

    const [item] = await this.db
      .select()
      .from(this.table)
      .where(whereClause)
      .limit(1);

    return mapNullToUndefined<E>(item as DatabaseResult<E>) || null;
  }

  abstract save(entity: E): Promise<E>;
  abstract update(id: string, updates: Partial<E>): Promise<E>;

  async count(filter?: FilterOptions<TFilterable>): Promise<number> {
    const whereClause = this.buildWhereClause(filter);

    const [{ count }] = await this.db
      .select({ count: sql<number>`count(*)` })
      .from(this.table)
      .where(whereClause);

    return Number(count);
  }
}
