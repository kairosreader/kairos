import type {
  BulkItemArchiveOperation,
  ItemArchiveOperation,
  MoveItemOperation,
} from "@kairos/shared/types/params";
import {
  BaseError,
  BulkOperationError,
  CollectionOperationError,
} from "@kairos/shared/types/errors";
import type { CollectionService } from "./collection.service.ts";
import type { SpecialCollectionService } from "./special-collection.service.ts";

export class ItemManagementService {
  constructor(
    private collectionService: CollectionService,
    private specialCollectionsService: SpecialCollectionService,
  ) {}

  async moveItem(params: MoveItemOperation): Promise<void> {
    const { itemInfo, toCollectionId, removeFromOtherCollections } = params;

    // Get the collections the item is currently in
    const currentCollections = await this.collectionService.findByItem(
      itemInfo.itemId,
    );

    // If item is already in the target collection and we're not removing from others, we're done
    if (
      currentCollections.some((c) => c.id === toCollectionId) &&
      !removeFromOtherCollections
    ) {
      return;
    }

    // Move the item to the target collection
    try {
      const operations = [];

      // Remove from other collections if requested
      if (removeFromOtherCollections) {
        operations.push(
          ...currentCollections
            .filter((c) => c.id !== toCollectionId)
            .map((c) =>
              this.collectionService.removeItem({
                id: c.id,
                userId: c.userId,
                itemInfo: itemInfo,
              })
            ),
        );
      }

      // Add to target collection if not already there
      if (!currentCollections.some((c) => c.id === params.toCollectionId)) {
        operations.push(
          this.collectionService.addItem({
            id: params.toCollectionId,
            userId: params.userId,
            itemInfo: itemInfo,
          }),
        );
      }
    } catch (error) {
      throw new CollectionOperationError(
        `Failed to move item: ${String(error)}`,
      );
    }
  }

  async archiveItem(params: ItemArchiveOperation): Promise<void> {
    const { itemInfo, userId } = params;

    // Get the archive collection
    const { archive } = await this.specialCollectionsService
      .ensureSpecialCollections(userId);

    // Move the item to the archive collection
    await this.moveItem({
      userId,
      itemInfo: itemInfo,
      toCollectionId: archive.id,
      removeFromOtherCollections: true,
    });
  }

  async bulkArchiveitems(params: BulkItemArchiveOperation): Promise<void> {
    const { itemInfos, userId } = params;
    const errors: BaseError[] = [];

    await Promise.all(
      itemInfos.map(async (itemInfo) => {
        try {
          await this.archiveItem({
            itemInfo,
            userId,
          });
        } catch (error) {
          if (error instanceof BaseError) {
            errors.push(error);
          } else {
            errors.push(
              new CollectionOperationError(
                `Unknown error archiving item ${itemInfo.itemId}: ${
                  String(
                    error,
                  )
                }`,
              ),
            );
          }
        }
      }),
    );

    if (errors.length > 0) {
      throw new BulkOperationError(`Failed to archive some items`, errors);
    }
  }
}
