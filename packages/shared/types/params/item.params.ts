import { ItemType } from "@shared/constants/item.constants.ts";
import { UserScoped } from "@shared/types/common/entity.types.ts";

export interface ItemParams extends UserScoped {}

export interface SaveItemParams<T = unknown> extends ItemParams {
  type: ItemType;
  content: T;
  tags?: string[];
}

export interface FindItemParams extends ItemParams {
  id: string;
}

export interface UpdateItemParams<T = unknown> extends ItemParams {
  id: string;
  updates: Partial<{
    title: string;
    excerpt: string;
    tags: string[];
    content: T;
  }>;
}
