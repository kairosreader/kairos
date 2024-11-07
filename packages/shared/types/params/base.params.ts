import { ItemType } from "@shared/constants/item.constants.ts";

// Base interfaces for common patterns
export interface UserScoped {
  userId: string;
}

export interface ResourceId {
  id: string;
}

export interface ResourceIdentifier extends UserScoped, ResourceId {}

export type ItemId = ResourceId["id"];
export type UserId = UserScoped["userId"];
export type TagId = ResourceId["id"];

export const isUserScoped = (obj: unknown): obj is UserScoped => {
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

export interface CreateParams<T> extends UserScoped {
  data: T;
}

export interface GetParams extends ResourceIdentifier {}

export interface DeleteParams extends ResourceIdentifier {}

export interface BulkDeleteParams extends UserScoped {
  ids: string[];
}

// Common filtering interfaces
export interface TagFilters {
  tags?: string[];
}

export interface TypeFilter {
  type?: ItemType;
}

export interface StatusFilter {
  status?: string;
}

export interface CollectionFilter {
  collectionId?: string;
}
