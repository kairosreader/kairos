import { TagColor } from "@shared/constants/tag.constants.ts";
import {
  CreateParams,
  SortablePaginatedQuery,
  UpdateParams,
  UserScoped,
} from "@shared/types/params/base.params.ts";

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

export interface ListTagsParams extends SortablePaginatedQuery {
  sortBy?: "name" | "itemCount";
}

export interface FindTagByNameParams extends UserScoped {
  tagName: string;
}

export interface TagItemOperation extends UserScoped {
  itemId: string;
  tagIds: string[];
}

export interface BulkTagItemOperation extends UserScoped {
  itemIds: string[];
  tagIds: string[];
}

export interface CreateManyTagsOperation extends UserScoped {
  tagInfos: TagData[];
}

export interface MergeTagsOperation extends UserScoped {
  sourceTagId: string;
  targetTagId: string;
}
