import { QueueHandler } from "@core/queue/queue.service.ts";
import { Item } from "@core/item/item.entity.ts";
import { ItemService } from "@core/item/item.service.ts";
import { ITEM_STATUS } from "@shared/constants/mod.ts";
import type { ItemContent } from "@shared/types/common/mod.ts";

export interface ItemProcessPayload {
  itemId: string;
  userId: string;
}

export abstract class BaseItemHandler
  implements QueueHandler<ItemProcessPayload>
{
  constructor(protected itemService: ItemService<ItemContent>) {}

  async handle(payload: ItemProcessPayload): Promise<void> {
    const { itemId, userId } = payload;

    try {
      const item = await this.itemService.tryFindById(itemId);

      await this.itemService.update(
        { id: itemId, userId },
        { status: ITEM_STATUS.PROCESSING },
      );

      await this.processItem(item);

      await this.itemService.update(
        { id: itemId, userId },
        { status: ITEM_STATUS.READY },
      );
    } catch (error) {
      await this.itemService.update(
        { id: itemId, userId },
        { status: ITEM_STATUS.FAILED },
      );
      throw error;
    }
  }

  protected abstract processItem(item: Item<ItemContent>): Promise<void>;
}
