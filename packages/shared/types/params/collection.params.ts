import type { ItemInfo } from "../common/item.types.ts";
import type {
  CreateParams,
  ResourceIdentifier,
  SortablePaginatedQuery,
  UpdateParams,
  UserScopedParams,
} from "./base.params.ts";

export interface CollectionData {
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  isDefault: boolean | null;
  isArchive: boolean | null;
}

export interface CreateCollectionParams extends CreateParams<CollectionData> {}

export interface UpdateCollectionData {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateCollectionParams
  extends UpdateParams<UpdateCollectionData> {}

export interface CollectionItemOperation extends ResourceIdentifier {
  itemInfo: ItemInfo;
}

export interface AddToCollectionParams extends CollectionItemOperation {}

export interface RemoveFromCollectionParams extends CollectionItemOperation {}

export interface MoveItemOperation extends UserScopedParams {
  itemInfo: ItemInfo;
  toCollectionId: string;
  removeFromOtherCollections?: boolean;
}

export interface ItemArchiveOperation extends UserScopedParams {
  itemInfo: ItemInfo;
}

export interface BulkItemArchiveOperation extends UserScopedParams {
  itemInfos: ItemInfo[];
}

export interface ListCollectionItemsParams
  extends SortablePaginatedQuery, UserScopedParams {
  collectionId: string;
  sortBy: "addedAt" | "title" | null;
}
