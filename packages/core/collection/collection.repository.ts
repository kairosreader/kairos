import type { Collection } from "@core/collection/collection.entity.ts";
import { UserScopedRepository } from "@core/common/base.repository.ts";
import { Item } from "@core/item/mod.ts";
import {
  AddToCollectionParams,
  RemoveFromCollectionParams,
} from "@shared/types/params/mod.ts";

export interface CollectionRepository extends UserScopedRepository<Collection> {
  findByItem(itemId: string): Promise<Collection[]>;
  findDefault(userId: string): Promise<Collection>;
  findArchive(userId: string): Promise<Collection>;

  // Collection items
  addItem(params: AddToCollectionParams): Promise<void>;
  removeItem(params: RemoveFromCollectionParams): Promise<void>;
  getItems(collectionId: string): Promise<Item[]>;
}
