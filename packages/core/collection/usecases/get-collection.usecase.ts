import type { GetParams } from "@kairos/shared/types";
import type { CollectionService } from "../collection.service.ts";
import type { Collection } from "../collection.entity.ts";

export class GetCollectionUseCase {
  constructor(private collectionService: CollectionService) {}

  async execute(params: GetParams): Promise<Collection> {
    const collection = this.collectionService.tryFindById(params.id);

    // Verify ownership
    await this.collectionService.verifyOwnership(params);

    return collection;
  }
}
