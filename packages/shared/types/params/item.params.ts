import { ItemContent } from "@shared/types/common/item.types.ts";
import { ItemType } from "@shared/constants/item.constants.ts";
import {
  CollectionFilter,
  ResourceIdentifier,
  SortablePaginatedQuery,
  StatusFilter,
  TagFilters,
  TypeFilter,
  UpdateParams,
  UserScoped,
} from "@shared/types/params/base.params.ts";

export interface CreateItemParams extends UserScoped {
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
    UserScoped,
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
