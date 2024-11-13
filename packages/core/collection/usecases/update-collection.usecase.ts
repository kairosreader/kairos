import type { UpdateCollectionParams } from "@kairos/shared/types";
import type { CollectionService } from "../collection.service.ts";
import type { Collection } from "../collection.entity.ts";

export class UpdateCollectionUseCase {
  constructor(private collectionService: CollectionService) {}

  execute(params: UpdateCollectionParams): Promise<Collection> {
    return this.collectionService.update(params);
  }
}
