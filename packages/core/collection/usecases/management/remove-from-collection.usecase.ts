import type { RemoveFromCollectionParams } from "@kairos/shared/types";
import type { CollectionService } from "../../collection.service.ts";

export class RemoveFromCollectionUseCase {
  constructor(private collectionService: CollectionService) {}

  execute(params: RemoveFromCollectionParams): Promise<void> {
    return this.collectionService.removeItem(params);
  }
}
