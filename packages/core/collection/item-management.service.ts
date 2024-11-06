import {
  BaseError,
  BulkOperationError,
  CollectionOperationError,
} from "@shared/types/errors/mod.ts";
import { CollectionService } from "@core/collection/collection.service.ts";
import { SpecialCollectionService } from "@core/collection/special-collection.service.ts";
import {
  ArchiveItemParams,
  MoveItemParams,
  BulkArchiveItemsParams,
} from "@shared/types/params/mod.ts";

export class ItemManagementService {
  constructor(
    private collectionService: CollectionService,
    private specialCollectionsService: SpecialCollectionService,
  ) {}

  async moveItem(params: MoveItemParams): Promise<void> {
    const { itemInfo, toCollectionId, removeFromOtherCollections } = params;

    // Get the collections the article is currently in
    const currentCollections = await this.collectionService.findByitem(
      itemInfo.itemId,
    );

    // If article is already in the target collection and we're not removing from others, we're done
    if (
      currentCollections.some((c) => c.id === toCollectionId) &&
      !removeFromOtherCollections
    ) {
      return;
    }

    // Move the article to the target collection
    try {
      const operations = [];

      // Remove from other collections if requested
      if (removeFromOtherCollections) {
        operations.push(
          ...currentCollections
            .filter((c) => c.id !== toCollectionId)
            .map((c) =>
              this.collectionService.removeItem({
                itemInfo: {
                  itemId: itemInfo.itemId,
                  itemType: itemInfo.itemType,
                },
                collectionId: c.id,
              }),
            ),
        );
      }

      // Add to target collection if not already there
      if (!currentCollections.some((c) => c.id === params.toCollectionId)) {
        operations.push(
          this.collectionService.addItem({
            itemInfo: {
              itemId: itemInfo.itemId,
              itemType: itemInfo.itemType,
            },
            collectionId: params.toCollectionId,
          }),
        );
      }
    } catch (error) {
      throw new CollectionOperationError(
        `Failed to move article: ${String(error)}`,
      );
    }
  }

  async archiveItem(params: ArchiveItemParams): Promise<void> {
    const { itemInfo, userId } = params;

    const { archive } =
      await this.specialCollectionsService.ensureSpecialCollections(userId);

    await this.moveItem({
      itemInfo: {
        itemId: itemInfo.itemId,
        itemType: itemInfo.itemType,
      },
      toCollectionId: archive.id,
      removeFromOtherCollections: true,
    });
  }

  async bulkArchiveitems(params: BulkArchiveItemsParams): Promise<void> {
    const { itemInfos, userId } = params;
    const errors: BaseError[] = [];

    await Promise.all(
      itemInfos.map(async (itemInfo) => {
        try {
          await this.archiveItem({
            itemInfo,
            userId: userId,
          });
        } catch (error) {
          if (error instanceof BaseError) {
            errors.push(error);
          } else {
            errors.push(
              new CollectionOperationError(
                `Unknown error archiving article ${itemInfo.itemId}: ${String(
                  error,
                )}`,
              ),
            );
          }
        }
      }),
    );

    if (errors.length > 0) {
      throw new BulkOperationError(`Failed to archive some articles`, errors);
    }
  }
}
