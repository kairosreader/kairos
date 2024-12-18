import type { ArticleContent, ItemContent } from "@kairos/shared/types";
import type { ItemService } from "../../item/item.service.ts";
import { BaseItemHandler } from "./item.handler.ts";
import type { ContentExtractorService } from "../../content/content-extractor.service.ts";
import type { Item } from "../../item/item.entity.ts";

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

    await this.itemService.update({
      id: item.id,
      userId: item.userId,
      updates: {
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
    });
  }
}
