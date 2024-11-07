import { ItemService } from "@core/item/item.service.ts";
import { ItemContent } from "@shared/types/common/mod.ts";
import { Item } from "@core/item/item.entity.ts";
import { ListItemsParams } from "@shared/types/params/mod.ts";

export class ListItemsUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  execute(params: ListItemsParams): Promise<Item<ItemContent>[]> {
    return this.itemService.findByUser(params.userId);
  }
}
