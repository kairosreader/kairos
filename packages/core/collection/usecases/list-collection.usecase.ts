import type { ListCollectionsParams } from "@kairos/shared/types";
import type { CollectionService } from "../collection.service.ts";
import type { Collection } from "../collection.entity.ts";

export class ListCollectionsUseCase {
  constructor(private collectionService: CollectionService) {}

  execute(params: ListCollectionsParams): Promise<Collection[]> {
    return this.collectionService.findByUser(params.userId);
  }
}
