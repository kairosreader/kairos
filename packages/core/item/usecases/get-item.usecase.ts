import { Item } from "@core/item/item.entity.ts";
import { ItemService } from "@core/item/item.service.ts";
import { ItemContent } from "@shared/types/common/mod.ts";
import { GetParams } from "@shared/types/params/mod.ts";

export class GetItemUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  async execute(params: GetParams): Promise<Item<ItemContent>> {
    const item = await this.itemService.tryFindById(params.id);

    // Verify ownership
    await this.itemService.verifyOwnership(params);

    return item;
  }
}
