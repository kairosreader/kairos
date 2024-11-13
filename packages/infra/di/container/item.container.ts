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
import { DrizzleItemRepository } from "../../repositories/postgres/item.repository.ts";
import type { QueueService } from "@kairos/core/queue";
import { TOKENS } from "../tokens.ts";

export function configureItemContainer(container: Container) {
  // Repository
  container.registerSingleton<ItemRepository<ItemContent>>(
    TOKENS.ItemRepository,
    () => new DrizzleItemRepository(),
  );

  // Service
  container.registerSingleton<ItemService<ItemContent>>(
    TOKENS.ItemService,
    () => {
      const itemRepo = container.resolve<ItemRepository<ItemContent>>(
        TOKENS.ItemRepository,
      );
      return new ItemService(itemRepo);
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
