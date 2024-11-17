import type { ItemContent, ResourceIdentifier } from "@kairos/shared";
import type { CollectionService } from "../../collection.service.ts";
import type { Item } from "../../../item/item.entity.ts";

export class GetItemsInCollectionUseCase {
  constructor(private collectionService: CollectionService) {}

  execute(params: ResourceIdentifier): Promise<Item<ItemContent>[]> {
    return this.collectionService.getItems(params);
  }
}
