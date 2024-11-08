import type { ItemType } from "../../constants/item.constants.ts";
import type { ItemContent } from "../common/item.types.ts";
import type {
  CollectionFilter,
  ResourceIdentifier,
  SortablePaginatedQuery,
  StatusFilter,
  TagFilters,
  TypeFilter,
  UpdateParams,
  UserScopedParams,
} from "./base.params.ts";

export interface CreateItemParams extends UserScopedParams {
  type: ItemType;
  content: ItemContent;
  tags?: string[];
}

export interface UpdateItemData {
  title: string;
  excerpt?: string;
  content: ItemContent;
  tags: string[];
  coverImage?: string;
  estimatedReadTime?: number;
}

export interface UpdateItemParams extends UpdateParams<UpdateItemData> {}

export interface ListItemsParams
  extends SortablePaginatedQuery,
    UserScopedParams,
    CollectionFilter,
    TagFilters,
    TypeFilter,
    StatusFilter {
  sortBy?: "createdAt" | "updatedAt" | "title";
}

export interface UpdateReadingProgressParams extends ResourceIdentifier {
  progress: number; // 0-100
  lastPosition: number;
}
