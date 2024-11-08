import type { CreateCollectionParams } from "@kairos/shared/types/params";
import type { CollectionService } from "../collection.service.ts";
import type { Collection } from "../collection.entity.ts";

export class CreateReadingListUseCase {
  constructor(private collectionService: CollectionService) {}

  execute(params: CreateCollectionParams): Promise<Collection> {
    return this.collectionService.create(params);
  }
}
