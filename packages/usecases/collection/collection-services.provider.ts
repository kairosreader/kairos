import type { Container, Module } from "@kairos/di";
import { DB_TOKENS, USECASES_TOKENS } from "@kairos/di/tokens";
import {
  type CollectionRepository,
  CollectionService,
  ItemManagementService,
  SpecialCollectionService,
} from "@kairos/core/collection";
import type { ItemService } from "@kairos/core/item";
import type { ItemContent } from "@kairos/shared";

export class CollectionServicesProvider implements Module {
  register(container: Container): void {
    container.registerSingleton(
      USECASES_TOKENS.Collection.CollectionService,
      () => {
        const collectionRepository = container.resolve<CollectionRepository>(
          DB_TOKENS.CollectionRepository,
        );
        const itemService = container.resolve<ItemService<ItemContent>>(
          USECASES_TOKENS.Item.ItemService,
        );
        return new CollectionService(collectionRepository, itemService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.SpecialCollectionService,
      () => {
        const collectionRepository = container.resolve<CollectionRepository>(
          DB_TOKENS.CollectionRepository,
        );
        return new SpecialCollectionService(collectionRepository);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.ItemManagementService,
      () => {
        const collectionService = container.resolve<CollectionService>(
          USECASES_TOKENS.Collection.CollectionService,
        );
        const specialCollectionService = container.resolve<
          SpecialCollectionService
        >(
          USECASES_TOKENS.Collection.SpecialCollectionService,
        );
        return new ItemManagementService(
          collectionService,
          specialCollectionService,
        );
      },
    );
  }
}
