import type { DeleteParams } from "@kairos/shared/types/params";
import type { CollectionService } from "../collection.service.ts";

export class DeleteReadingListUseCase {
  constructor(private collectionService: CollectionService) {}

  execute(params: DeleteParams): Promise<void> {
    return this.collectionService.delete(params);
  }
}
