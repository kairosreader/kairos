import type { EmailContent, ItemContent } from "@kairos/shared/types";
import type { ItemService } from "../../item/item.service.ts";
import { BaseItemHandler } from "./item.handler.ts";
import type { Item } from "../../item/item.entity.ts";

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
