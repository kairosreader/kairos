import { BaseItemHandler } from "@kairos/core/queue";
import type { Item, ItemService } from "@kairos/core/item";
import type { EmailContent, ItemContent } from "@kairos/shared/types/common";

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
