import type { Container, Module } from "@kairos/di";
import { USECASES_TOKENS } from "@kairos/di/tokens";
import {
  AddToCollectionUseCase,
  ArchiveItemUseCase,
  BulkArchiveUseCase,
  type CollectionService,
  CreateCollectionUseCase,
  DeleteCollectionUseCase,
  GetCollectionUseCase,
  GetItemsInCollectionUseCase,
  type ItemManagementService,
  ListCollectionsUseCase,
  MoveItemUseCase,
  RemoveFromCollectionUseCase,
  UpdateCollectionUseCase,
} from "@kairos/core/collection";

export class CollectionUseCasesProvider implements Module {
  register(container: Container): void {
    container.registerSingleton(
      USECASES_TOKENS.Collection.CreateCollectionUseCase,
      () => {
        const collectionService = container.resolve<CollectionService>(
          USECASES_TOKENS.Collection.CollectionService,
        );
        return new CreateCollectionUseCase(collectionService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.GetCollectionUseCase,
      () => {
        const collectionService = container.resolve<CollectionService>(
          USECASES_TOKENS.Collection.CollectionService,
        );
        return new GetCollectionUseCase(collectionService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.UpdateCollectionUseCase,
      () => {
        const collectionService = container.resolve<CollectionService>(
          USECASES_TOKENS.Collection.CollectionService,
        );
        return new UpdateCollectionUseCase(collectionService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.DeleteCollectionUseCase,
      () => {
        const collectionService = container.resolve<CollectionService>(
          USECASES_TOKENS.Collection.CollectionService,
        );
        return new DeleteCollectionUseCase(collectionService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.ListCollectionsUseCase,
      () => {
        const collectionService = container.resolve<CollectionService>(
          USECASES_TOKENS.Collection.CollectionService,
        );
        return new ListCollectionsUseCase(collectionService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.GetItemsInCollectionUseCase,
      () => {
        const collectionService = container.resolve<CollectionService>(
          USECASES_TOKENS.Collection.CollectionService,
        );
        return new GetItemsInCollectionUseCase(collectionService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.AddToCollectionUseCase,
      () => {
        const collectionService = container.resolve<CollectionService>(
          USECASES_TOKENS.Collection.CollectionService,
        );
        return new AddToCollectionUseCase(collectionService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.RemoveFromCollectionUseCase,
      () => {
        const collectionService = container.resolve<CollectionService>(
          USECASES_TOKENS.Collection.CollectionService,
        );
        return new RemoveFromCollectionUseCase(collectionService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.MoveItemUseCase,
      () => {
        const itemManagementService = container.resolve<ItemManagementService>(
          USECASES_TOKENS.Collection.ItemManagementService,
        );
        return new MoveItemUseCase(itemManagementService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.ArchiveItemUseCase,
      () => {
        const itemManagementService = container.resolve<ItemManagementService>(
          USECASES_TOKENS.Collection.ItemManagementService,
        );
        return new ArchiveItemUseCase(itemManagementService);
      },
    );

    container.registerSingleton(
      USECASES_TOKENS.Collection.BulkArchiveUseCase,
      () => {
        const itemManagementService = container.resolve<ItemManagementService>(
          USECASES_TOKENS.Collection.ItemManagementService,
        );
        return new BulkArchiveUseCase(itemManagementService);
      },
    );
  }
}
