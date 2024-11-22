import type { FilterConfig } from "./filter.types.ts";
import type { PaginationOptions } from "./pagination.types.ts";
import type { SortOptions } from "./sort.types.ts";

export interface QueryOptions<
  TSortFields extends string,
  TFilterFields extends string,
> {
  pagination: PaginationOptions;
  sort?: SortOptions<TSortFields>[];
  filters?: FilterConfig<TFilterFields>;
  search?: string;
}
