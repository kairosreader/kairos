// Base interfaces for common patterns
export interface UserScopedParams {
  userId: string;
}

export interface ResourceId {
  id: string;
}

export interface ResourceIdentifier extends UserScopedParams, ResourceId {}

export type ItemId = ResourceId["id"];
export type UserId = UserScopedParams["userId"];
export type TagId = ResourceId["id"];

export const isUserScoped = (obj: unknown): obj is UserScopedParams => {
  return typeof obj === "object" && obj !== null && "userId" in obj;
};

export const hasResourceId = (obj: unknown): obj is ResourceId => {
  return typeof obj === "object" && obj !== null && "id" in obj;
};

// Generic pagination interface
export interface PaginationParams {
  page?: number;
  limit?: number;
  cursor?: string;
}

export interface PaginatedQuery extends PaginationParams {
  searchQuery?: string;
}

export interface SortablePaginatedQuery extends PaginatedQuery {
  sortOrder?: "asc" | "desc";
}

// Base CRUD interfaces
export interface UpdateParams<T> extends ResourceIdentifier {
  updates: Partial<T>;
}

export interface CreateParams<T> extends UserScopedParams {
  data: T;
}

export interface GetParams extends ResourceIdentifier {}

export interface DeleteParams extends ResourceIdentifier {}

export interface BulkDeleteParams extends UserScopedParams {
  ids: string[];
}
