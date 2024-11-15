import { BaseController } from "../common/controller/base.controller.ts";
import type {
  CreateTagUseCase,
  DeleteTagUseCase,
  TagItemUseCase,
  BulkTagUseCase,
  MergeTagsUseCase,
  GetTagUseCase,
  UpdateTagUseCase,
  ListTagsUseCase,
} from "@kairos/core/tag/usecases";
import {
  createTagRoute,
  deleteTagRoute,
  getTagRoute,
  listTagsRoute,
  updateTagRoute,
  tagItemRoute,
  bulkTagRoute,
  mergeTagsRoute,
} from "./tag.routes.ts";
import {
  TagListResponseSchema,
  TagResponseSchema,
} from "./schema/response/response.schema.ts";
import {
  TagNotFoundError,
  UnauthorizedError,
} from "@kairos/shared/types/errors";

export class TagController extends BaseController {
  constructor(
    private createUseCase: CreateTagUseCase,
    private updateUseCase: UpdateTagUseCase,
    private getUseCase: GetTagUseCase,
    private listUseCase: ListTagsUseCase,
    private deleteUseCase: DeleteTagUseCase,
    private tagItemUseCase: TagItemUseCase,
    private bulkTagUseCase: BulkTagUseCase,
    private mergeTagsUseCase: MergeTagsUseCase,
  ) {
    super();
  }

  register() {
    this.router
      .openapi(createTagRoute, async (c) => {
        const data = c.req.valid("json");
        const userId = c.get("userId");

        const tag = await this.createUseCase.execute({
          userId,
          data,
        });

        const validatedTag = TagResponseSchema.parse(tag);
        return c.json(validatedTag, 201);
      })
      .openapi(updateTagRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");
        const updates = c.req.valid("json");

        const tag = await this.updateUseCase.execute({
          id,
          userId,
          updates,
        });

        const validatedTag = TagResponseSchema.parse(tag);
        return c.json(validatedTag);
      })
      .openapi(getTagRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");

        const tag = await this.getUseCase.execute({ id, userId });

        if (!tag) {
          throw new TagNotFoundError(id);
        }

        if (tag.userId !== userId) {
          throw new UnauthorizedError(
            "You don't have permission to access this tag",
          );
        }

        const validatedTag = TagResponseSchema.parse(tag);
        return c.json(validatedTag);
      })
      .openapi(listTagsRoute, async (c) => {
        const userId = c.get("userId");
        const tags = await this.listUseCase.execute({ userId });
        const validatedTags = TagListResponseSchema.parse(tags);
        return c.json(validatedTags);
      })
      .openapi(deleteTagRoute, async (c) => {
        const userId = c.get("userId");
        const { id } = c.req.valid("param");
        await this.deleteUseCase.execute({ id, userId });
        return c.json(null, 204);
      })
      .openapi(tagItemRoute, async (c) => {
        const userId = c.get("userId");
        const { itemId, tagIds } = c.req.valid("json");
        await this.tagItemUseCase.execute({ userId, itemId, tagIds });
        return c.json(null, 200);
      })
      .openapi(bulkTagRoute, async (c) => {
        const userId = c.get("userId");
        const { itemIds, tagIds } = c.req.valid("json");
        await this.bulkTagUseCase.execute({ userId, itemIds, tagIds });
        return c.json(null, 200);
      })
      .openapi(mergeTagsRoute, async (c) => {
        const userId = c.get("userId");
        const { sourceTagId, targetTagId } = c.req.valid("json");
        await this.mergeTagsUseCase.execute({
          userId,
          sourceTagId,
          targetTagId,
        });
        return c.json(null, 200);
      });

    return this.router;
  }
}
