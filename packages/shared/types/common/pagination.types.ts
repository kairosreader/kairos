// Pagination Types
export interface OffsetPagination {
  type: "offset";
  page: number;
  pageSize: number;
}

export interface CursorPagination {
  type: "cursor";
  cursor?: string;
  pageSize: number;
}

export type PaginationOptions = OffsetPagination | CursorPagination;

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
