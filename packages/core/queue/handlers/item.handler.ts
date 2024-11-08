import type { ItemContent } from "@kairos/shared/types/common";
import type { ItemService } from "../../item/item.service.ts";
import type { QueueHandler } from "../queue.service.ts";
import { ITEM_STATUS } from "@kairos/shared/constants";
import type { Item } from "../../item/item.entity.ts";

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

      await this.itemService.update({
        id: itemId,
        userId,
        updates: { status: ITEM_STATUS.PROCESSING },
      });

      await this.processItem(item);

      await this.itemService.update({
        id: itemId,
        userId,
        updates: { status: ITEM_STATUS.READY },
      });
    } catch (error) {
      await this.itemService.update({
        id: itemId,
        userId,
        updates: { status: ITEM_STATUS.FAILED },
      });
      throw error;
    }
  }

  protected abstract processItem(item: Item<ItemContent>): Promise<void>;
}
