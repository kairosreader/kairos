import type { Container, Module } from "@kairos/di";
import { QUEUE_TOKENS, USECASES_TOKENS } from "@kairos/di/tokens";
import {
  BulkDeleteItemsUseCase,
  DeleteItemUseCase,
  GetItemUseCase,
  type ItemService,
  ListItemsUseCase,
  SaveItemUseCase,
  UpdateItemUseCase,
  UpdateReadingProgressUseCase,
} from "@kairos/core/item";
import type { ItemContent } from "@kairos/shared";
import type { QueueService } from "@kairos/core/queue";
import type { TagService } from "@kairos/core/tag";

export class ItemUseCasesProvider implements Module {
  register(container: Container): void {
    container.registerSingleton(
      USECASES_TOKENS.Item.SaveItemUseCase,
      () => {
        const itemService = container.resolve<ItemService<ItemContent>>(
          USECASES_TOKENS.Item.ItemService,
        );
        const tagService = container.resolve<TagService>(
          USECASES_TOKENS.Tag.TagService,
        );
        const queueService = container.resolve<QueueService>(
          QUEUE_TOKENS.QueueService,
        );
        return new SaveItemUseCase(itemService, tagService, queueService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Item.GetItemUseCase,
      () => {
        const itemService = container.resolve<ItemService<ItemContent>>(
          USECASES_TOKENS.Item.ItemService,
        );
        return new GetItemUseCase(itemService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Item.UpdateItemUseCase,
      () => {
        const itemService = container.resolve<ItemService<ItemContent>>(
          USECASES_TOKENS.Item.ItemService,
        );
        return new UpdateItemUseCase(itemService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Item.DeleteItemUseCase,
      () => {
        const itemService = container.resolve<ItemService<ItemContent>>(
          USECASES_TOKENS.Item.ItemService,
        );
        return new DeleteItemUseCase(itemService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Item.BulkDeleteItemsUseCase,
      () => {
        const itemService = container.resolve<ItemService<ItemContent>>(
          USECASES_TOKENS.Item.ItemService,
        );
        return new BulkDeleteItemsUseCase(itemService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Item.ListItemsUseCase,
      () => {
        const itemService = container.resolve<ItemService<ItemContent>>(
          USECASES_TOKENS.Item.ItemService,
        );
        return new ListItemsUseCase(itemService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Item.UpdateReadingProgressUseCase,
      () => {
        const itemService = container.resolve<ItemService<ItemContent>>(
          USECASES_TOKENS.Item.ItemService,
        );
        return new UpdateReadingProgressUseCase(itemService);
      },
    );
  }
}
