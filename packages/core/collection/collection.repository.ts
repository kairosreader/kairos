import type {
  AddToCollectionParams,
  RemoveFromCollectionParams,
} from "@kairos/shared/types/params";
import type { ItemContent } from "@kairos/shared";
import type { UserScopedRepository } from "../common/base.repository.ts";
import type {
  Collection,
  CollectionFilterableFields,
  CollectionSortableFields,
} from "./collection.entity.ts";
import type { Item } from "../item/item.entity.ts";

export interface CollectionRepository extends
  UserScopedRepository<
    Collection,
    CollectionSortableFields,
    CollectionFilterableFields
  > {
  findByItem(itemId: string): Promise<Collection[]>;
  findDefault(userId: string): Promise<Collection>;
  findArchive(userId: string): Promise<Collection>;

  // Collection items
  addItem(params: AddToCollectionParams): Promise<void>;
  removeItem(params: RemoveFromCollectionParams): Promise<void>;
  getItems(collectionId: string): Promise<Item<ItemContent>[]>;
}
