import type { PaginatedResponse, QueryOptions } from "@kairos/shared/types";
import type { CollectionService } from "../collection.service.ts";
import type {
  Collection,
  CollectionFilterableFields,
  CollectionSortableFields,
} from "../collection.entity.ts";

export interface ListCollectionsParams {
  userId: string;
  options?: QueryOptions<CollectionSortableFields, CollectionFilterableFields>;
}

export class ListCollectionsUseCase {
  constructor(private collectionService: CollectionService) {}

  execute(
    params: ListCollectionsParams,
  ): Promise<PaginatedResponse<Collection>> {
    return this.collectionService.findByUser(params.userId, params.options);
  }
}
