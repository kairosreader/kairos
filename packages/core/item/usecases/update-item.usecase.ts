import { ItemService } from "@core/item/item.service.ts";
import { Item } from "@core/item/item.entity.ts";
import { ItemContent } from "@shared/types/common/mod.ts";
import { UpdateItemParams } from "@shared/types/params/mod.ts";

export class UpdateItemUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  async execute(
    params: UpdateItemParams<ItemContent>,
  ): Promise<Item<ItemContent>> {
    const item = await this.itemService.tryFindById(params.id);

    // Update article
    const updatedItem: Item<ItemContent> = {
      ...item,
      ...params.updates,
      updatedAt: new Date(),
    };

    return this.itemService.update(
      {
        id: params.id,
        userId: params.userId,
      },
      updatedItem,
    );
  }
}
