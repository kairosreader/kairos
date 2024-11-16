import type { ItemContent } from "@kairos/shared/types";
import type {
  PaginatedResponse,
  QueryOptions,
} from "@kairos/shared/types/common";
import type { ItemService } from "../item.service.ts";
import type {
  Item,
  ItemFilterableFields,
  ItemSortableFields,
} from "../item.entity.ts";

export interface ListItemsParams {
  userId: string;
  options?: QueryOptions<ItemSortableFields, ItemFilterableFields>;
}

export class ListItemsUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  execute(
    params: ListItemsParams,
  ): Promise<PaginatedResponse<Item<ItemContent>>> {
    return this.itemService.findByUser(params.userId, params.options);
  }
}
