import "reflect-metadata";
import { Container } from "@core/di/container.ts";
import { TOKENS } from "@infra/di/tokens.ts";
import {
  ItemRepository,
  ItemService,
  SaveItemUseCase,
  UpdateItemUseCase,
} from "@core/item/mod.ts";
import { ContentExtractorService } from "@core/content/content-extractor.service.ts";
import { QueueService } from "@core/queue/queue.service.ts";
import { BullQueueService } from "@infra/queue/bull/bull-queue.service.ts";
import { ReadabilityExtractorService } from "@infra/content/readability/readability-extractor.service.ts";
import { ArticleProcessingHandler } from "@infra/queue/handlers/article.handler.ts";
import { EmailProcessingHandler } from "@infra/queue/handlers/email.handler.ts";
import { PostgresItemRepository } from "@infra/repositories/postgres/item.repository.ts";
import { ItemContent } from "@shared/types/common/mod.ts";

export function configureContainer(
  container: Container,
  config: {
    redis: {
      host: string;
      port: number;
      password?: string;
    };
  },
) {
  // Repositories
  container.registerSingleton<ItemRepository<ItemContent>>(
    TOKENS.ItemRepository,
    () => {
      return new PostgresItemRepository();
    },
  );

  // Services
  container.registerSingleton<ItemService<ItemContent>>(
    TOKENS.ItemService,
    () => {
      const itemRepo = container.resolve<ItemRepository<ItemContent>>(
        TOKENS.ItemRepository,
      );
      return new ItemService(itemRepo);
    },
  );

  container.registerSingleton<QueueService>(TOKENS.QueueService, () => {
    return new BullQueueService(config);
  });

  container.registerSingleton<ContentExtractorService>(
    TOKENS.ContentExtractorService,
    () => new ReadabilityExtractorService(),
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

  // Use Cases
  container.registerSingleton(TOKENS.SaveItemUseCase, () => {
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    const queueService = container.resolve<QueueService>(TOKENS.QueueService);
    return new SaveItemUseCase(itemService, queueService);
  });

  container.registerSingleton(TOKENS.UpdateItemUseCase, () => {
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    return new UpdateItemUseCase(itemService);
  });
}
