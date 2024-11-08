import "reflect-metadata";
import type { Container, QueueService } from "@kairos/core";
import { type ItemRepository, ItemService } from "@kairos/core/item";
import {
  BulkDeleteItemsUseCase,
  DeleteItemUseCase,
  GetItemUseCase,
  ListItemsUseCase,
  SaveItemUseCase,
  UpdateItemUseCase,
  UpdateReadingProgressUseCase,
} from "@kairos/core/item/usecases";
import type { ItemContent } from "@kairos/shared/types/common";
import { DrizzleItemRepository } from "../repositories/postgres/item.repository.ts";
import { TOKENS } from "./tokens.ts";
import { BullQueueService } from "../queue/bull/bull-queue.service.ts";
import type { ContentExtractorService } from "@kairos/core/content";
import { ReadabilityExtractorService } from "../content/readability/readability-extractor.service.ts";
import { ArticleProcessingHandler } from "../queue/handlers/article.handler.ts";
import { EmailProcessingHandler } from "../queue/handlers/email.handler.ts";

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
      return new DrizzleItemRepository();
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

  container.registerSingleton(TOKENS.GetItemUseCase, () => {
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    return new GetItemUseCase(itemService);
  });

  container.registerSingleton(TOKENS.ListItemsUseCase, () => {
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    return new ListItemsUseCase(itemService);
  });

  container.registerSingleton(TOKENS.UpdateReadingProgressUseCase, () => {
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    return new UpdateReadingProgressUseCase(itemService);
  });

  container.registerSingleton(TOKENS.DeleteItemUseCase, () => {
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    return new DeleteItemUseCase(itemService);
  });

  container.registerSingleton(TOKENS.BulkDeleteItemsUseCase, () => {
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    return new BulkDeleteItemsUseCase(itemService);
  });
}
