import { SaveItemUseCase, UpdateItemUseCase } from "@core/item/usecases/mod.ts";
import {
  UnauthorizedError,
  ItemNotFoundError,
} from "@shared/types/errors/mod.ts";
import { BaseController } from "@api/common/controller/base.controller.ts";
import {
  bulkDeleteItemsRoute,
  createItemRoute,
  deleteItemRoute,
  getItemRoute,
  listItemsRoute,
  updateItemRoute,
  updateReadingProgressRoute,
} from "@api/item/item.routes.ts";
import {
  ItemListResponseSchema,
  ItemResponseSchema,
} from "@api/item/schema/response/response.schema.ts";
import { BulkDeleteItemsUseCase } from "@core/item/usecases/bulk-delete-items.usecase.ts";
import { GetItemUseCase } from "@core/item/usecases/get-item.usecase.ts";
import { ListItemsUseCase } from "@core/item/usecases/list-item.usecase.ts";
import { UpdateReadingProgressUseCase } from "@core/item/usecases/update-reading-progress.usecase.ts";
import { DeleteItemUseCase } from "@core/item/usecases/delete-item.usecase.ts";

export class ItemController extends BaseController {
  constructor(
    private saveUseCase: SaveItemUseCase,
    private updateUseCase: UpdateItemUseCase,
    private getItemUseCase: GetItemUseCase,
    private listUseCase: ListItemsUseCase,
    private updateReadingProgressUseCase: UpdateReadingProgressUseCase,
    private deleteUseCase: DeleteItemUseCase,
    private bulkDeleteUseCase: BulkDeleteItemsUseCase,
  ) {
    super();
  }

  register() {
    this.router
      .openapi(createItemRoute, async (c) => {
        const data = c.req.valid("json");
        const userId = c.get("userId");

        const item = await this.saveUseCase.execute({
          type: data.type,
          content: data.content,
          tags: data.tags,
          userId,
        });

        const validatedItem = ItemResponseSchema.parse(item);
        return c.json(validatedItem, 201);
      })
      .openapi(updateItemRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");
        const updates = c.req.valid("json");

        const item = await this.updateUseCase.execute({
          id,
          updates: {
            content: updates.content,
            tags: updates.tags,
            title: updates.title,
            excerpt: updates.excerpt,
          },
          userId,
        });

        const validatedItem = ItemResponseSchema.parse(item);
        return c.json(validatedItem);
      })
      .openapi(getItemRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");

        const item = await this.getItemUseCase.execute({
          id: id,
          userId: userId,
        });

        if (!item) {
          throw new ItemNotFoundError(id);
        }

        if (item.userId !== userId) {
          throw new UnauthorizedError(
            "You don't have permission to access this item",
          );
        }

        const validatedItem = ItemResponseSchema.parse(item);
        return c.json(validatedItem);
      })
      .openapi(updateReadingProgressRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");
        const { progress, lastPosition } = c.req.valid("json");
        await this.updateReadingProgressUseCase.execute({
          id,
          userId,
          progress,
          lastPosition,
        });
        return c.json(null);
      })
      .openapi(listItemsRoute, async (c) => {
        const userId = c.get("userId");
        const items = await this.listUseCase.execute({ userId });
        const validatedItems = ItemListResponseSchema.parse(items);
        return c.json(validatedItems);
      })
      .openapi(deleteItemRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");
        await this.deleteUseCase.execute({ id, userId });
        return c.json(null, 204);
      })
      .openapi(bulkDeleteItemsRoute, async (c) => {
        const userId = c.get("userId");
        const { ids } = c.req.valid("json");
        await this.bulkDeleteUseCase.execute({ ids, userId });
        return c.json(null, 204);
      });

    return this.router;
  }
}
