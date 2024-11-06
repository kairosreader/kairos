import { CreateCollectionParams } from "@shared/types/params/mod.ts";
import { Collection } from "@core/collection/collection.entity.ts";
import { CollectionService } from "@core/collection/collection.service.ts";

export class CreateReadingListUseCase {
  constructor(private collectionService: CollectionService) {}

  execute(params: CreateCollectionParams): Promise<Collection> {
    return this.collectionService.create(params);
  }
}
