import type {
  AddToCollectionParams,
  CreateCollectionParams,
  ItemContent,
  RemoveFromCollectionParams,
} from "@kairos/shared/types";
import {
  CollectionNotFoundError,
  ItemNotFoundError,
} from "@kairos/shared/types/errors";
import { UserScopedService } from "../common/base.service.ts";
import type { ItemService } from "../item/item.service.ts";
import type { Collection } from "./collection.entity.ts";
import type { CollectionRepository } from "./collection.repository.ts";

export class CollectionService extends UserScopedService<Collection> {
  protected override resourceName: string;
  constructor(
    private collectionRepo: CollectionRepository,
    private itemRepo: ItemService<ItemContent>,
  ) {
    super(collectionRepo);
    this.resourceName = "Collection";
  }

  create(params: CreateCollectionParams): Promise<Collection> {
    const collection: Collection = {
      id: crypto.randomUUID(),
      userId: params.userId,
      name: params.data.name,
      description: params.data.description,
      isDefault: false,
      isArchive: false,
      color: params.data.color,
      icon: params.data.icon,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.collectionRepo.save(collection);
  }

  async addItem(params: AddToCollectionParams): Promise<void> {
    const { id, itemInfo } = params;

    // Check if item exists
    const item = await this.itemRepo.findById(itemInfo.itemId);
    if (!item) {
      throw new ItemNotFoundError(itemInfo.itemId);
    }

    // Check if target list exists
    const targetList = await this.collectionRepo.findById(id);
    if (!targetList) {
      throw new CollectionNotFoundError(id);
    }

    // Add the new item
    await this.collectionRepo.addItem(params);
  }

  async removeItem(params: RemoveFromCollectionParams): Promise<void> {
    await this.collectionRepo.removeItem(params);
  }

  findByItem(itemId: string): Promise<Collection[]> {
    return this.collectionRepo.findByItem(itemId);
  }
}
