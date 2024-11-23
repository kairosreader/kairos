import type { Container } from "@kairos/di";
import { USECASES_TOKENS } from "@kairos/di/tokens";
import type {
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
} from "@kairos/core/collection";
import { CollectionController } from "./collection.controller.ts";

export function createCollectionController(
  container: Container,
): CollectionController {
  return new CollectionController(
    container.resolve<CreateCollectionUseCase>(
      USECASES_TOKENS.Collection.CreateCollectionUseCase,
    ),
    container.resolve<UpdateCollectionUseCase>(
      USECASES_TOKENS.Collection.UpdateCollectionUseCase,
    ),
    container.resolve<GetCollectionUseCase>(
      USECASES_TOKENS.Collection.GetCollectionUseCase,
    ),
    container.resolve<ListCollectionsUseCase>(
      USECASES_TOKENS.Collection.ListCollectionsUseCase,
    ),
    container.resolve<DeleteCollectionUseCase>(
      USECASES_TOKENS.Collection.DeleteCollectionUseCase,
    ),
    container.resolve<AddToCollectionUseCase>(
      USECASES_TOKENS.Collection.AddToCollectionUseCase,
    ),
    container.resolve<GetItemsInCollectionUseCase>(
      USECASES_TOKENS.Collection.GetItemsInCollectionUseCase,
    ),
    container.resolve<RemoveFromCollectionUseCase>(
      USECASES_TOKENS.Collection.RemoveFromCollectionUseCase,
    ),
    container.resolve<MoveItemUseCase>(
      USECASES_TOKENS.Collection.MoveItemUseCase,
    ),
    container.resolve<ArchiveItemUseCase>(
      USECASES_TOKENS.Collection.ArchiveItemUseCase,
    ),
    container.resolve<BulkArchiveUseCase>(
      USECASES_TOKENS.Collection.BulkArchiveUseCase,
    ),
  );
}
