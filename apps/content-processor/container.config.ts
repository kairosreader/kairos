import {
  Container,
  CONTENT_TOKENS,
  QUEUE_TOKENS,
  USECASES_TOKENS,
} from "@kairos/di";
import { QueueModule } from "@kairos/queue";
import { DB_TOKENS } from "@kairos/di/tokens";
import { type Database, db } from "@kairos/db";
import { DrizzleItemRepository } from "@kairos/db/repository";
import { ItemService } from "@kairos/core/item";
import type { ItemRepository } from "@kairos/core/item";
import type { ContentExtractorService } from "@kairos/core/content";
import {
  ArticleProcessingHandler,
  EmailProcessingHandler,
} from "@kairos/core/queue/handlers";
import type { ItemContent } from "@kairos/shared";
import { ReadabilityExtractorService } from "@kairos/content";

export interface ContentProcessorConfig {
  redis: {
    host: string;
    port: number;
    password?: string;
  };
}

export function configureContainer(config: ContentProcessorConfig) {
  const container = new Container();

  // Register database connection
  container.registerSingleton<Database>(DB_TOKENS.Database, () => db);

  // Register only the item repository
  container.registerSingleton<ItemRepository<ItemContent>>(
    DB_TOKENS.ItemRepository,
    () => {
      const db = container.resolve<Database>(DB_TOKENS.Database);
      return new DrizzleItemRepository(db);
    },
  );

  // Register minimal required services
  container.registerSingleton(USECASES_TOKENS.Item.ItemService, () => {
    const itemRepo = container.resolve<ItemRepository<ItemContent>>(
      DB_TOKENS.ItemRepository,
    );
    return new ItemService(itemRepo);
  });

  container.registerSingleton(CONTENT_TOKENS.ContentService, () => {
    return new ReadabilityExtractorService();
  });

  // Register processing handlers
  container.registerSingleton(QUEUE_TOKENS.Handlers.ArticleHandler, () => {
    const itemService = container.resolve<ItemService<ItemContent>>(
      USECASES_TOKENS.Item.ItemService,
    );
    const contentExtractor = container.resolve<ContentExtractorService>(
      CONTENT_TOKENS.ContentService,
    );
    return new ArticleProcessingHandler(itemService, contentExtractor);
  });

  container.registerSingleton(QUEUE_TOKENS.Handlers.EmailHandler, () => {
    // TODO: implement email handler
    const itemService = container.resolve<ItemService<ItemContent>>(
      USECASES_TOKENS.Item.ItemService,
    );
    return new EmailProcessingHandler(itemService);
  });

  // Register queue infrastructure
  new QueueModule(config).register(container);

  return container;
}
