import type { Container } from "@kairos/core/di";
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
import type { QueueService } from "@kairos/core/queue";
import { TOKENS } from "../tokens.ts";
import { DrizzleItemRepository } from "../../db/drizzle/repository/item.repository.ts";
import type { Database } from "../../db/connection.ts";
import type { TagService } from "@kairos/core/tag";

export function configureItemBasicServices(container: Container) {
  // Repository
  container.registerSingleton<ItemRepository<ItemContent>>(
    TOKENS.ItemRepository,
    () => {
      const db = container.resolve<Database>(TOKENS.DbClient);
      return new DrizzleItemRepository(db);
    },
  );

  // Service
  container.registerSingleton<ItemService<ItemContent>>(
    TOKENS.ItemService,
    () => {
      const repository = container.resolve<ItemRepository<ItemContent>>(
        TOKENS.ItemRepository,
      );
      return new ItemService(repository);
    },
  );
}

export function configureItemUseCases(container: Container) {
  // Use Cases
  container.registerSingleton(TOKENS.SaveItemUseCase, () => {
    const itemService = container.resolve<ItemService<ItemContent>>(
      TOKENS.ItemService,
    );
    const tagService = container.resolve<TagService>(TOKENS.TagService);
    const queueService = container.resolve<QueueService>(TOKENS.QueueService);
    return new SaveItemUseCase(itemService, tagService, queueService);
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
