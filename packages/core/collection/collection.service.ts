import type {
  AddToCollectionParams,
  CreateCollectionParams,
  ItemContent,
  RemoveFromCollectionParams,
  ResourceIdentifier,
} from "@kairos/shared/types";
import { UserScopedService } from "../common/base.service.ts";
import type { ItemService } from "../item/item.service.ts";
import type { Collection } from "./collection.entity.ts";
import type { CollectionRepository } from "./collection.repository.ts";
import type { Item } from "../item/item.entity.ts";

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
    await this.itemRepo.tryFindById(itemInfo.itemId);

    // Check if target list exists
    await this.tryFindById(id);

    // Add the new item
    await this.collectionRepo.addItem(params);
  }

  async removeItem(params: RemoveFromCollectionParams): Promise<void> {
    const { id, itemInfo } = params;

    // Check if item exists
    await this.itemRepo.tryFindById(itemInfo.itemId);

    // Check if target collection exists
    await this.tryFindById(id);

    await this.collectionRepo.removeItem(params);
  }

  findByItem(itemId: string): Promise<Collection[]> {
    return this.collectionRepo.findByItem(itemId);
  }

  async findDefault(userId: string): Promise<Collection> {
    const defaultCollection = await this.collectionRepo.findDefault(userId);
    if (!defaultCollection) {
      // Create default collection if it doesn't exist
      return this.create({
        userId,
        data: {
          name: "Default Collection",
          description: "Your default collection",
          isDefault: true,
        },
      });
    }
    return defaultCollection;
  }

  async findArchive(userId: string): Promise<Collection> {
    const archiveCollection = await this.collectionRepo.findArchive(userId);
    if (!archiveCollection) {
      // Create archive collection if it doesn't exist
      return this.create({
        userId,
        data: {
          name: "Archive",
          description: "Your archived items",
          isArchive: true,
        },
      });
    }
    return archiveCollection;
  }

  async getItems(params: ResourceIdentifier): Promise<Item<ItemContent>[]> {
    // Check if collection exists
    await this.tryFindById(params.id);

    return this.collectionRepo.getItems(params.id);
  }
}
