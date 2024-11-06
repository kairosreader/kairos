import { BaseItemHandler } from "@core/queue/handlers/item.handler.ts";
import { ItemService } from "@core/item/item.service.ts";
import { ContentExtractorService } from "@core/content/content-extractor.service.ts";
import type {
  ArticleContent,
  ItemContent,
} from "@shared/types/common/item.types.ts";
import { Item } from "@core/item/mod.ts";

export class ArticleProcessingHandler extends BaseItemHandler {
  constructor(
    itemService: ItemService<ItemContent>,
    private contentExtractor: ContentExtractorService,
  ) {
    super(itemService);
  }

  protected async processItem(item: Item<ItemContent>): Promise<void> {
    const content = item.content as ArticleContent;
    const extractedContent = await this.contentExtractor.extractFromUrl(
      content.url,
    );

    await this.itemService.update(
      { id: item.id, userId: item.userId },
      {
        content: {
          ...content,
          content: extractedContent.content,
          author: extractedContent.author,
          publishedAt: extractedContent.publishedAt,
        },
        title: extractedContent.title,
        excerpt: extractedContent.excerpt,
        coverImage: extractedContent.coverImage,
        estimatedReadTime: extractedContent.estimatedReadTime,
      },
    );
  }
}
