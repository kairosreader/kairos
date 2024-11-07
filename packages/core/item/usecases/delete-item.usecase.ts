import { ItemService } from "@core/item/item.service.ts";
import { ItemContent } from "@shared/types/mod.ts";
import { DeleteParams } from "@shared/types/params/mod.ts";

export class DeleteItemUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  async execute(params: DeleteParams): Promise<void> {
    await this.itemService.delete(params);
  }
}
