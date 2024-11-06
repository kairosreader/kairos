import type { Collection } from "@core/collection/collection.entity.ts";
import type { CollectionRepository } from "@core/collection/collection.repository.ts";
import {
  CollectionNotFoundError,
  ItemNotFoundError,
} from "@shared/types/errors/mod.ts";
import {
  AddToCollectionParams,
  CreateCollectionParams,
  RemoveFromCollectionParams,
} from "@shared/types/params/mod.ts";
import { UserScopedService } from "@core/common/base.service.ts";
import { ItemContent } from "@shared/types/common/mod.ts";
import { ItemService } from "@core/item/item.service.ts";

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
      name: params.name,
      description: params.description,
      isDefault: false,
      isArchive: false,
      color: params.color,
      icon: params.icon,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return this.collectionRepo.save(collection);
  }

  async addItem(params: AddToCollectionParams): Promise<void> {
    const { collectionId, itemInfo } = params;
    // Check if article exists
    const article = await this.itemRepo.findById(itemInfo.itemId);
    if (!article) {
      throw new ItemNotFoundError(itemInfo.itemId);
    }

    // Check if target list exists
    const targetList = await this.collectionRepo.findById(collectionId);
    if (!targetList) {
      throw new CollectionNotFoundError(collectionId);
    }

    // Add the new item
    await this.collectionRepo.addItem({
      collectionId: collectionId,
      itemInfo: itemInfo,
    });
  }

  async removeItem(params: RemoveFromCollectionParams): Promise<void> {
    await this.collectionRepo.removeItem({
      collectionId: params.collectionId,
      itemInfo: params.itemInfo,
    });
  }

  findByitem(itemId: string): Promise<Collection[]> {
    return this.collectionRepo.findByItem(itemId);
  }
}
