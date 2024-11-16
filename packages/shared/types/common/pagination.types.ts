export type SortDirection = "asc" | "desc";

export interface SortOptions<T extends string> {
  field: T;
  direction: SortDirection;
}

export interface OffsetPagination {
  type: "offset";
  page: number;
  limit: number;
}

export interface CursorPagination {
  type: "cursor";
  cursor?: string;
  limit: number;
}

export type PaginationOptions = OffsetPagination | CursorPagination;

export interface FilterOperator {
  eq?: unknown;
  neq?: unknown;
  gt?: number | Date;
  gte?: number | Date;
  lt?: number | Date;
  lte?: number | Date;
  in?: unknown[];
  nin?: unknown[];
  contains?: string;
  startsWith?: string;
  endsWith?: string;
}

export type FilterOptions<T extends string> = Partial<
  Record<T, FilterOperator>
>;

export interface QueryOptions<
  TSortable extends string,
  TFilterable extends string,
> {
  pagination: PaginationOptions;
  sort?: SortOptions<TSortable>;
  filter?: FilterOptions<TFilterable>;
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageInfo: PageInfo;
}
