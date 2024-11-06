import { SaveItemParams } from "@shared/types/params/mod.ts";
import { QueueService } from "@core/queue/queue.service.ts";
import { ItemService } from "@core/item/item.service.ts";
import { Item } from "@core/item/item.entity.ts";
import { ITEM_STATUS, ITEM_TYPE, ItemType } from "@shared/constants/mod.ts";
import {
  isArticleContent,
  isEmailContent,
  isPdfContent,
  ItemContent,
} from "@shared/types/common/mod.ts";

export class SaveItemUseCase {
  constructor(
    private itemService: ItemService<ItemContent>,
    private queueService: QueueService,
  ) {}

  async execute(
    params: SaveItemParams<ItemContent>,
  ): Promise<Item<ItemContent>> {
    // Validate content based on type
    this.validateContent(params.type, params.content);

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

  private validateContent(type: ItemType, content: unknown): void {
    switch (type) {
      case ITEM_TYPE.ARTICLE:
        if (!isArticleContent(content)) {
          throw new Error("Invalid article content");
        }
        break;
      case ITEM_TYPE.EMAIL:
        if (!isEmailContent(content)) {
          throw new Error("Invalid email content");
        }
        break;
      case ITEM_TYPE.PDF:
        if (!isPdfContent(content)) {
          throw new Error("Invalid PDF content");
        }
        break;
      default:
        throw new Error(`Unsupported item type: ${type}`);
    }
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
