import {
  SPECIAL_COLLECTION,
  type SpecialCollection,
} from "@kairos/shared/constants";
import type { Collection } from "./collection.entity.ts";
import type { CollectionRepository } from "./collection.repository.ts";

export class SpecialCollectionService {
  constructor(private collectionRepo: CollectionRepository) {}

  async ensureSpecialCollections(userId: string): Promise<{
    recent: Collection;
    archive: Collection;
  }> {
    const [recent, archive] = await Promise.all([
      this.ensureCollection(userId, SPECIAL_COLLECTION.RECENT),
      this.ensureCollection(userId, SPECIAL_COLLECTION.ARCHIVE),
    ]);

    return { recent, archive };
  }

  private getCollectionByType(userId: string, type: SpecialCollection) {
    switch (type) {
      case SPECIAL_COLLECTION.RECENT:
        return this.collectionRepo.findDefault(userId);
      case SPECIAL_COLLECTION.ARCHIVE:
        return this.collectionRepo.findArchive(userId);
    }
  }

  private async ensureCollection(
    userId: string,
    type: SpecialCollection,
  ): Promise<Collection> {
    const existingList = await this.getCollectionByType(userId, type);

    if (existingList) return existingList;

    return this.collectionRepo.save({
      id: crypto.randomUUID(),
      userId,
      name: type === "recent" ? "Recent" : "Archive",
      isDefault: type === SPECIAL_COLLECTION.RECENT,
      isArchive: type === SPECIAL_COLLECTION.ARCHIVE,
      itemCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
