import { OpenAPIHono } from "@hono/zod-openapi";
import { SaveItemUseCase, UpdateItemUseCase } from "@core/item/usecases/mod.ts";
import { ItemService } from "@core/item/mod.ts";
import {
  UnauthorizedError,
  ItemNotFoundError,
} from "@shared/types/errors/mod.ts";
import { ItemContent } from "@shared/types/common/mod.ts";
import { errorHandler, pinoLogger } from "@api/middleware/mod.ts";
import {
  createItemRoute,
  deleteItemRoute,
  getItemRoute,
  listItemsRoute,
  updateItemRoute,
} from "@api/item/item.route.def.ts";

export class ItemRoutes {
  router: OpenAPIHono;

  constructor(
    private saveItemUseCase: SaveItemUseCase,
    private updateItemUseCase: UpdateItemUseCase,
    private itemService: ItemService<ItemContent>,
  ) {
    this.router = new OpenAPIHono({
      defaultHook: (result, c) => {
        if (!result.success) {
          return errorHandler(result.error, c as any);
        }
      },
    });
    this.router.onError(errorHandler as any);
    this.router.use(pinoLogger());
    this.register = this.register.bind(this);
    this.extractUserId = this.extractUserId.bind(this);
  }

  // TODO: Use JWT auth as a middleware
  private extractUserId(authHeader: string): string {
    if (!authHeader?.startsWith("Bearer ")) {
      throw new UnauthorizedError("Invalid authorization header");
    }

    const token = authHeader.split(" ")[1];
    return "user123"; // Placeholder
  }

  register() {
    this.router.openapi(createItemRoute, async (c) => {
      const { authorization } = c.req.valid("header");
      const userId = this.extractUserId(authorization);
      const { type, content, tags } = c.req.valid("json");

      const item = await this.saveItemUseCase.execute({
        type,
        content,
        tags,
        userId,
      });

      return c.json(item, 201);
    });

    this.router.openapi(updateItemRoute, async (c) => {
      const { authorization } = c.req.valid("header");
      const userId = this.extractUserId(authorization);
      const { id } = c.req.valid("param");
      const updates = c.req.valid("json");

      const item = await this.updateItemUseCase.execute({
        id,
        updates: {
          content: updates.content,
          tags: updates.tags,
          title: updates.title,
          excerpt: updates.excerpt,
        },
        userId,
      });

      return c.json(item);
    });

    this.router.openapi(getItemRoute, async (c) => {
      const { authorization } = c.req.valid("header");
      const userId = this.extractUserId(authorization);
      const { id } = c.req.valid("param");

      const item = await this.itemService.findById(id);

      if (!item) {
        throw new ItemNotFoundError(id);
      }

      if (item.userId !== userId) {
        throw new UnauthorizedError(
          "You don't have permission to access this item",
        );
      }

      return c.json(item);
    });

    this.router.openapi(listItemsRoute, async (c) => {
      const { authorization } = c.req.valid("header");
      const userId = this.extractUserId(authorization);

      const items = await this.itemService.findByUser(userId);
      return c.json(items);
    });

    this.router.openapi(deleteItemRoute, async (c) => {
      const { authorization } = c.req.valid("header");
      const userId = this.extractUserId(authorization);
      const { id } = c.req.valid("param");

      await this.itemService.delete({ id, userId });
      return c.json({}, 204);
    });

    return this.router;
  }
}
