import type { ItemContent, UpdateItemParams } from "@kairos/shared/types";
import type { ItemService } from "../item.service.ts";
import type { Item } from "../item.entity.ts";

export class UpdateItemUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  execute(params: UpdateItemParams): Promise<Item<ItemContent>> {
    return this.itemService.update(params);
  }
}
