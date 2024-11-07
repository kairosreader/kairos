import { QueueService } from "@core/queue/queue.service.ts";
import { ItemService } from "@core/item/item.service.ts";
import { Item } from "@core/item/item.entity.ts";
import { ITEM_STATUS } from "@shared/constants/mod.ts";
import {
  isArticleContent,
  isEmailContent,
  isPdfContent,
  ItemContent,
} from "@shared/types/common/mod.ts";
import { CreateItemParams } from "@shared/types/params/mod.ts";

export class SaveItemUseCase {
  constructor(
    private itemService: ItemService<ItemContent>,
    private queueService: QueueService,
  ) {}

  async execute(params: CreateItemParams): Promise<Item<ItemContent>> {
    const item: Item<ItemContent> = {
      id: crypto.randomUUID(),
      type: params.type,
      status: ITEM_STATUS.PENDING,
      title: this.getTitleFromContent(params.content),
      content: params.content,
      tags: params.tags ?? [],
      userId: params.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const savedItem = await this.itemService.save(item);

    // Queue type-specific processing
    await this.queueService.enqueue(`${params.type}.process`, {
      itemId: item.id,
      userId: params.userId,
    });

    return savedItem;
  }

  private getTitleFromContent(content: unknown): string {
    if (isArticleContent(content)) {
      return content.url;
    }
    if (isEmailContent(content)) {
      return content.subject;
    }
    if (isPdfContent(content)) {
      return content.metadata?.title ?? "Untitled PDF";
    }
    return "Untitled Item";
  }
}
