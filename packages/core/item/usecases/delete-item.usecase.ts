import type { DeleteParams, ItemContent } from "@kairos/shared/types";
import type { ItemService } from "../item.service.ts";

export class DeleteItemUseCase {
  constructor(private itemService: ItemService<ItemContent>) {}

  async execute(params: DeleteParams): Promise<void> {
    await this.itemService.delete(params);
  }
}
