import { BaseController } from "../common/controller/base.controller.ts";
import type {
  AddToCollectionUseCase,
  ArchiveItemUseCase,
  BulkArchiveUseCase,
  CreateCollectionUseCase,
  DeleteCollectionUseCase,
  GetCollectionUseCase,
  ListCollectionsUseCase,
  MoveItemUseCase,
  RemoveFromCollectionUseCase,
  UpdateCollectionUseCase,
} from "@kairos/core/collection/usecases";
import {
  addToCollectionRoute,
  archiveItemRoute,
  bulkArchiveRoute,
  createCollectionRoute,
  deleteCollectionRoute,
  getCollectionRoute,
  listCollectionsRoute,
  moveItemRoute,
  removeFromCollectionRoute,
  updateCollectionRoute,
} from "./collection.routes.ts";
import {
  CollectionListResponseSchema,
  CollectionResponseSchema,
} from "./schema/response/response.schema.ts";
import {
  CollectionNotFoundError,
  UnauthorizedError,
} from "@kairos/shared/types/errors";

export class CollectionController extends BaseController {
  constructor(
    private createUseCase: CreateCollectionUseCase,
    private updateUseCase: UpdateCollectionUseCase,
    private getUseCase: GetCollectionUseCase,
    private listUseCase: ListCollectionsUseCase,
    private deleteUseCase: DeleteCollectionUseCase,
    private addToCollectionUseCase: AddToCollectionUseCase,
    private removeFromCollectionUseCase: RemoveFromCollectionUseCase,
    private moveItemUseCase: MoveItemUseCase,
    private archiveItemUseCase: ArchiveItemUseCase,
    private bulkArchiveUseCase: BulkArchiveUseCase,
  ) {
    super();
  }

  register() {
    this.router
      .openapi(createCollectionRoute, async (c) => {
        const data = c.req.valid("json");
        const userId = c.get("userId");

        const collection = await this.createUseCase.execute({
          userId,
          data,
        });

        const validatedCollection = CollectionResponseSchema.parse(collection);
        return c.json(validatedCollection, 201);
      })
      .openapi(updateCollectionRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");
        const updates = c.req.valid("json");

        const collection = await this.updateUseCase.execute({
          id,
          userId,
          updates,
        });

        const validatedCollection = CollectionResponseSchema.parse(collection);
        return c.json(validatedCollection);
      })
      .openapi(getCollectionRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");

        const collection = await this.getUseCase.execute({ id, userId });

        if (!collection) {
          throw new CollectionNotFoundError(id);
        }

        if (collection.userId !== userId) {
          throw new UnauthorizedError(
            "You don't have permission to access this collection",
          );
        }

        const validatedCollection = CollectionResponseSchema.parse(collection);
        return c.json(validatedCollection);
      })
      .openapi(listCollectionsRoute, async (c) => {
        const userId = c.get("userId");
        const collections = await this.listUseCase.execute({ userId });
        const validatedCollections = CollectionListResponseSchema.parse(
          collections,
        );
        return c.json(validatedCollections);
      })
      .openapi(deleteCollectionRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");
        await this.deleteUseCase.execute({ id, userId });
        return c.json(null, 204);
      })
      .openapi(addToCollectionRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");
        const { itemInfo } = c.req.valid("json");
        await this.addToCollectionUseCase.execute({ id, userId, itemInfo });
        return c.json(null, 200);
      })
      .openapi(removeFromCollectionRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");
        const { itemInfo } = c.req.valid("json");
        await this.removeFromCollectionUseCase.execute({
          id,
          userId,
          itemInfo,
        });
        return c.json(null, 200);
      })
      .openapi(moveItemRoute, async (c) => {
        const userId = c.get("userId");
        const data = c.req.valid("json");
        await this.moveItemUseCase.execute({
          userId,
          itemInfo: data.itemInfo,
          toCollectionId: data.toCollectionId,
          removeFromOtherCollections: data.removeFromOtherCollections,
        });
        return c.json(null, 200);
      })
      .openapi(archiveItemRoute, async (c) => {
        const userId = c.get("userId");
        const { itemInfo } = c.req.valid("json");
        await this.archiveItemUseCase.execute({ userId, itemInfo });
        return c.json(null, 200);
      })
      .openapi(bulkArchiveRoute, async (c) => {
        const userId = c.get("userId");
        const { itemInfos } = c.req.valid("json");
        await this.bulkArchiveUseCase.execute({ userId, itemInfos });
        return c.json(null, 204);
      });

    return this.router;
  }
}
