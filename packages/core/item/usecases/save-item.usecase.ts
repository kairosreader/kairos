import {
  isArticleContent,
  isEmailContent,
  isPdfContent,
  type ItemContent,
} from "@kairos/shared/types/common";
import type { CreateItemParams } from "@kairos/shared/types/params";
import type { ItemService } from "../item.service.ts";
import type { QueueService } from "../../queue/queue.service.ts";
import type { Item } from "../item.entity.ts";
import { ITEM_STATUS } from "@kairos/shared/constants";
import type { TagService } from "../../tag/tag.service.ts";

export class SaveItemUseCase {
  constructor(
    private itemService: ItemService<ItemContent>,
    private tagService: TagService,
    private queueService: QueueService,
  ) {}

  async execute(params: CreateItemParams): Promise<Item<ItemContent>> {
    // Verify tags exist for the user
    if (params.tags) {
      await this.tagService.verifyOwnershipMany(
        params.tags.map((tag) => ({
          id: tag,
          userId: params.userId,
        })),
      );
    }

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
