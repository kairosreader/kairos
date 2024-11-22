export type SortDirection = "asc" | "desc";

export interface SortOptions<T> {
  field: T;
  direction: SortDirection;
}
