import type { Container } from "@kairos/core/di";
import { ArticleProcessingHandler } from "../../queue/handlers/article.handler.ts";
import { TOKENS } from "../tokens.ts";
import type { ItemService } from "@kairos/core/item";
import type { ItemContent } from "@kairos/shared/types/common";
import type { ContentExtractorService } from "@kairos/core/content";
import { EmailProcessingHandler } from "../../queue/handlers/email.handler.ts";
import type { QueueService } from "@kairos/core/queue";
import { BullQueueService } from "../../queue/bull/bull-queue.service.ts";
import { ReadabilityExtractorService } from "../../content/readability/mod.ts";

export function configureQueueContainer(
  container: Container,
  config: {
    redis: {
      host: string;
      port: number;
      password?: string;
    };
  },
) {
  // Services
  container.registerSingleton<QueueService>(TOKENS.QueueService, () => {
    return new BullQueueService(config);
  });
  container.registerSingleton<ContentExtractorService>(
    TOKENS.ContentExtractorService,
    () => {
      return new ReadabilityExtractorService();
    },
  );

  // Handlers
  container.registerSingleton<ArticleProcessingHandler>(
    TOKENS.ArticleProcessingHandler,
    () => {
      const itemService = container.resolve<ItemService<ItemContent>>(
        TOKENS.ItemService,
      );
      const contentExtractor = container.resolve<ContentExtractorService>(
        TOKENS.ContentExtractorService,
      );
      return new ArticleProcessingHandler(itemService, contentExtractor);
    },
  );

  container.registerSingleton<EmailProcessingHandler>(
    TOKENS.EmailProcessingHandler,
    () => {
      const itemService = container.resolve<ItemService<ItemContent>>(
        TOKENS.ItemService,
      );
      return new EmailProcessingHandler(itemService);
    },
  );
}
