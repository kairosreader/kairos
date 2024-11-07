import {
  CreateParams,
  ResourceIdentifier,
  SortablePaginatedQuery,
  UpdateParams,
  UserScoped,
} from "@shared/types/params/base.params.ts";
import { ItemInfo } from "@shared/types/common/item.types.ts";

export interface CollectionData {
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface CreateCollectionParams extends CreateParams<CollectionData> {}

export interface UpdateCollectionData {
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface UpdateCollectionParams
  extends UpdateParams<UpdateCollectionData> {}

export interface ListCollectionsParams
  extends SortablePaginatedQuery,
    UserScoped {
  sortBy?: "name" | "createdAt" | "itemCount";
}

export interface CollectionItemOperation extends ResourceIdentifier {
  itemInfo: ItemInfo;
}

export interface AddToCollectionParams extends CollectionItemOperation {}

export interface RemoveFromCollectionParams extends CollectionItemOperation {}

export interface MoveItemOperation extends UserScoped {
  itemInfo: ItemInfo;
  toCollectionId: string;
  removeFromOtherCollections?: boolean;
}

export interface ItemArchiveOperation extends UserScoped {
  itemInfo: ItemInfo;
}

export interface BulkItemArchiveOperation extends UserScoped {
  itemInfos: ItemInfo[];
}

export interface ListCollectionItemsParams
  extends SortablePaginatedQuery,
    UserScoped {
  collectionId: string;
  sortBy?: "addedAt" | "title";
}
