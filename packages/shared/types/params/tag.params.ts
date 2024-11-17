import type { TagColor } from "../../constants/tag.constants.ts";
import type {
  CreateParams,
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

export interface FindTagByNameParams extends UserScopedParams {
  tagName: string;
}

export interface FindTagsByNamesParams extends UserScopedParams {
  tagNames: string[];
}

export interface TagItemOperation extends UserScopedParams {
  itemId: string;
  tagInfos: TagData[];
}

export interface BulkTagItemOperation extends UserScopedParams {
  itemIds: string[];
  tagInfos: TagData[];
}

export interface CreateManyTagsOperation extends UserScopedParams {
  tagInfos: TagData[];
}

export interface MergeTagsOperation extends UserScopedParams {
  sourceTagId: string;
  targetTagId: string;
}
