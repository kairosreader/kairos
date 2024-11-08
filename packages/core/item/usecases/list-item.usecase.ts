import type { ItemContent, ListItemsParams } from "@kairos/shared/types";
import type { ItemService } from "../item.service.ts";
import type { Item } from "../item.entity.ts";

export class ListItemsUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  execute(params: ListItemsParams): Promise<Item<ItemContent>[]> {
    return this.itemService.findByUser(params.userId);
  }
}
