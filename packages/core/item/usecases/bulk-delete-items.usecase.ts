import { ItemService } from "@core/item/item.service.ts";
import { ItemContent } from "@shared/types/common/mod.ts";
import { BulkDeleteParams } from "@shared/types/params/mod.ts";

export class BulkDeleteItemsUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  async execute(params: BulkDeleteParams): Promise<void> {
    const { ids, userId } = params;
    await this.itemService.bulkDelete(ids.map((id) => ({ id, userId })));
  }
}
