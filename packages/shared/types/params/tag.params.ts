import type { TagColor } from "../../constants/tag.constants.ts";
import type {
  CreateParams,
  SortablePaginatedQuery,
  UpdateParams,
  UserScopedParams,
} from "./base.params.ts";

export interface TagData {
  name: string;
  color?: TagColor;
}

export interface CreateTagParams extends CreateParams<TagData> {}

export interface UpdateTagData {
  name: string;
  color: TagColor;
}

export interface UpdateTagParams extends UpdateParams<UpdateTagData> {}

export interface ListTagsParams
  extends SortablePaginatedQuery, UserScopedParams {
  sortBy?: "name" | "itemCount";
}

export interface FindTagByNameParams extends UserScopedParams {
  tagName: string;
}

export interface TagItemOperation extends UserScopedParams {
  itemId: string;
  tagIds: string[];
}

export interface BulkTagItemOperation extends UserScopedParams {
  itemIds: string[];
  tagIds: string[];
}

export interface CreateManyTagsOperation extends UserScopedParams {
  tagInfos: TagData[];
}

export interface MergeTagsOperation extends UserScopedParams {
  sourceTagId: string;
  targetTagId: string;
}
