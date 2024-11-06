import { DeleteCollectionParams } from "@shared/types/params/collection.params.ts";
import { CollectionService } from "@core/collection/collection.service.ts";

export class DeleteReadingListUseCase {
  constructor(private collectionService: CollectionService) {}

  execute(params: DeleteCollectionParams): Promise<void> {
    return this.collectionService.delete({
      id: params.collectionId,
      userId: params.userId,
    });
  }
}
