import { BaseItemHandler } from "@core/queue/mod.ts";
import { Item, ItemService } from "@core/item/mod.ts";
import type { EmailContent, ItemContent } from "@shared/types/common/mod.ts";

export class EmailProcessingHandler extends BaseItemHandler {
  constructor(itemService: ItemService<ItemContent>) {
    super(itemService);
  }

  protected async processItem(item: Item<ItemContent>): Promise<void> {
    const content = item.content as EmailContent;
    const estimatedReadTime = Math.ceil(
      content.content.split(/\s+/).length / 200,
    );

    await this.itemService.update({
      id: item.id,
      userId: item.userId,
      updates: { estimatedReadTime },
    });
  }
}
