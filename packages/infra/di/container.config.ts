import "reflect-metadata";
import type { Container, QueueService } from "@kairos/core";
import { type ItemRepository, ItemService } from "@kairos/core/item";
import type { CollectionRepository } from "@kairos/core/collection";
import {
  BulkDeleteItemsUseCase,
  DeleteItemUseCase,
  GetItemUseCase,
  ListItemsUseCase,
  SaveItemUseCase,
  UpdateItemUseCase,
  UpdateReadingProgressUseCase,
} from "@kairos/core/item/usecases";
import {
  CollectionService,
  ItemManagementService,
  SpecialCollectionService,
} from "@kairos/core/collection";
import {
  CreateCollectionUseCase,
  DeleteCollectionUseCase,
  AddToCollectionUseCase,
  ArchiveItemUseCase,
  BulkArchiveUseCase,
  MoveItemUseCase,
  RemoveFromCollectionUseCase,
  UpdateCollectionUseCase,
  GetCollectionUseCase,
  ListCollectionsUseCase,
} from "@kairos/core/collection/usecases";
import type { ItemContent } from "@kairos/shared/types/common";
import { DrizzleItemRepository } from "../repositories/postgres/item.repository.ts";
import { DrizzleCollectionRepository } from "../repositories/postgres/collection.repository.ts";
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
  container.registerSingleton<CollectionRepository>(
    TOKENS.CollectionRepository,
    () => {
      return new DrizzleCollectionRepository();
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

  container.registerSingleton<CollectionService>(
    TOKENS.CollectionService,
    () => {
      const collectionRepo = container.resolve<CollectionRepository>(
        TOKENS.CollectionRepository,
      );
      const itemService = container.resolve<ItemService<ItemContent>>(
        TOKENS.ItemService,
      );
      return new CollectionService(collectionRepo, itemService);
    },
  );

  container.registerSingleton<SpecialCollectionService>(
    TOKENS.SpecialCollectionService,
    () => {
      const collectionRepo = container.resolve<CollectionRepository>(
        TOKENS.CollectionRepository,
      );
      return new SpecialCollectionService(collectionRepo);
    },
  );

  container.registerSingleton<ItemManagementService>(
    TOKENS.ItemManagementService,
    () => {
      const collectionService = container.resolve<CollectionService>(
        TOKENS.CollectionService,
      );
      const specialCollectionService =
        container.resolve<SpecialCollectionService>(
          TOKENS.SpecialCollectionService,
        );
      return new ItemManagementService(
        collectionService,
        specialCollectionService,
      );
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

  container.registerSingleton(TOKENS.CreateCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new CreateCollectionUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.UpdateCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new UpdateCollectionUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.GetCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new GetCollectionUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.ListCollectionsUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new ListCollectionsUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.DeleteCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new DeleteCollectionUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.AddToCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new AddToCollectionUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.RemoveFromCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new RemoveFromCollectionUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.MoveItemUseCase, () => {
    const itemManagementService = container.resolve<ItemManagementService>(
      TOKENS.ItemManagementService,
    );
    return new MoveItemUseCase(itemManagementService);
  });

  container.registerSingleton(TOKENS.ArchiveItemUseCase, () => {
    const itemManagementService = container.resolve<ItemManagementService>(
      TOKENS.ItemManagementService,
    );
    return new ArchiveItemUseCase(itemManagementService);
  });

  container.registerSingleton(TOKENS.BulkArchiveUseCase, () => {
    const itemManagementService = container.resolve<ItemManagementService>(
      TOKENS.ItemManagementService,
    );
    return new BulkArchiveUseCase(itemManagementService);
  });
}
