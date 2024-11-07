import { ItemService } from "@core/item/item.service.ts";
import { Item } from "@core/item/item.entity.ts";
import { ItemContent } from "@shared/types/common/mod.ts";
import { UpdateItemParams } from "@shared/types/params/mod.ts";

export class UpdateItemUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  execute(params: UpdateItemParams): Promise<Item<ItemContent>> {
    return this.itemService.update(params);
  }
}
