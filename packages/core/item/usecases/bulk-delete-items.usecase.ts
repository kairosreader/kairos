import type { BulkDeleteParams, ItemContent } from "@kairos/shared/types";
import type { ItemService } from "../item.service.ts";

export class BulkDeleteItemsUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  async execute(params: BulkDeleteParams): Promise<void> {
    const { ids, userId } = params;
    await this.itemService.bulkDelete(ids.map((id) => ({ id, userId })));
  }
}
