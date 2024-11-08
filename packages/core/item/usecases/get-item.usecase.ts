import type { GetParams, ItemContent } from "@kairos/shared/types";
import type { ItemService } from "../item.service.ts";
import type { Item } from "../item.entity.ts";

export class GetItemUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  async execute(params: GetParams): Promise<Item<ItemContent>> {
    const item = await this.itemService.tryFindById(params.id);

    // Verify ownership
    await this.itemService.verifyOwnership(params);

    return item;
  }
}
