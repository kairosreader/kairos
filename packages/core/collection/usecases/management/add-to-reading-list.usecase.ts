import { AddToCollectionParams } from "@shared/types/params/mod.ts";
import { CollectionService } from "@core/collection/collection.service.ts";

export class AddToReadingListUseCase {
  constructor(private collectionService: CollectionService) {}

  execute(params: AddToCollectionParams): Promise<void> {
    // Get the current highest order number
    return this.collectionService.addItem(params);
  }
}
