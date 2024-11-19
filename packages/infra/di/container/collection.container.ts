import type { Container } from "@kairos/core/di";
import {
  type CollectionRepository,
  SpecialCollectionService,
} from "@kairos/core/collection";
import {
  CollectionService,
  ItemManagementService,
} from "@kairos/core/collection";
import {
  AddToCollectionUseCase,
  ArchiveItemUseCase,
  BulkArchiveUseCase,
  CreateCollectionUseCase,
  DeleteCollectionUseCase,
  GetCollectionUseCase,
  GetItemsInCollectionUseCase,
  ListCollectionsUseCase,
  MoveItemUseCase,
  RemoveFromCollectionUseCase,
  UpdateCollectionUseCase,
} from "@kairos/core/collection/usecases";
import { TOKENS } from "../tokens.ts";
import type { ItemService } from "@kairos/core/item";
import type { ItemContent } from "@kairos/shared/types/common";
import type { Database } from "../../db/connection.ts";
import { DrizzleCollectionRepository } from "../../db/drizzle/repository/collection.repository.ts";

export function configureCollectionBasicServices(container: Container) {
  // Repository
  container.registerSingleton<CollectionRepository>(
    TOKENS.CollectionRepository,
    () => {
      const db = container.resolve<Database>(TOKENS.DbClient);
      return new DrizzleCollectionRepository(db);
    },
  );

  // Services
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
      const collectionRepository = container.resolve<CollectionRepository>(
        TOKENS.CollectionRepository,
      );
      return new SpecialCollectionService(collectionRepository);
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
}

export function configureCollectionUseCases(container: Container) {
  // Use Cases
  container.registerSingleton(TOKENS.CreateCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new CreateCollectionUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.GetCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new GetCollectionUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.UpdateCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new UpdateCollectionUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.DeleteCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new DeleteCollectionUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.ListCollectionsUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new ListCollectionsUseCase(collectionService);
  });

  container.registerSingleton(TOKENS.GetItemsInCollectionUseCase, () => {
    const collectionService = container.resolve<CollectionService>(
      TOKENS.CollectionService,
    );
    return new GetItemsInCollectionUseCase(collectionService);
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
