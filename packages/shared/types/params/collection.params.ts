import { ItemInfo } from "@shared/types/common/mod.ts";

export interface CreateCollectionParams {
  userId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface DeleteCollectionParams {
  collectionId: string;
  userId: string;
}

export interface AddToCollectionParams {
  itemInfo: ItemInfo;
  collectionId: string;
}

export interface RemoveFromCollectionParams {
  itemInfo: ItemInfo;
  collectionId: string;
}

export interface ArchiveItemParams {
  itemInfo: ItemInfo;
  userId: string;
}

export interface BulkArchiveItemsParams {
  itemInfos: ItemInfo[];
  userId: string;
}

export interface MoveItemParams {
  itemInfo: ItemInfo;
  toCollectionId: string;
  removeFromOtherCollections?: boolean;
}
