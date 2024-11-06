import { BaseItemHandler } from "@core/queue/handlers/item.handler.ts";
import { ItemService } from "@core/item/item.service.ts";
import type {
  EmailContent,
  ItemContent,
} from "@shared/types/common/item.types.ts";
import { Item } from "@core/item/mod.ts";

export class EmailProcessingHandler extends BaseItemHandler {
  constructor(itemService: ItemService<ItemContent>) {
    super(itemService);
  }

  protected async processItem(item: Item<ItemContent>): Promise<void> {
    const content = item.content as EmailContent;
    const estimatedReadTime = Math.ceil(
      content.content.split(/\s+/).length / 200,
    );

    await this.itemService.update(
      { id: item.id, userId: item.userId },
      { estimatedReadTime },
    );
  }
}
