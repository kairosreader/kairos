import { BaseItemHandler } from "@kairos/core/queue";
import type { Item, ItemService } from "@kairos/core/item";
import type { ArticleContent, ItemContent } from "@kairos/shared/types/common";
import type { ContentExtractorService } from "@kairos/core/content";

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
