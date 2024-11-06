import { BaseItemHandler } from "@core/queue/mod.ts";
import { Item, ItemService } from "@core/item/mod.ts";
import { ContentExtractorService } from "@core/content/mod.ts";
import type { ArticleContent, ItemContent } from "@shared/types/common/mod.ts";

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
