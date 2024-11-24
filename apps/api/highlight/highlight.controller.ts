import { BaseController } from "../common/controller/base.controller.ts";
import type {
  BulkDeleteHighlightsUseCase,
  CreateHighlightUseCase,
  DeleteHighlightUseCase,
  GetHighlightUseCase,
  ListHighlightsUseCase,
  UpdateHighlightUseCase,
} from "@kairos/core/highlight/usecases";
import {
  bulkDeleteHighlightsRoute,
  createHighlightRoute,
  deleteHighlightRoute,
  getHighlightRoute,
  listHighlightsRoute,
  updateHighlightRoute,
} from "./highlight.routes.ts";
import { HighlightListResponseSchema } from "./schema/response/response.schema.ts";

export class HighlightController extends BaseController {
  constructor(
    private createUseCase: CreateHighlightUseCase,
    private updateUseCase: UpdateHighlightUseCase,
    private getUseCase: GetHighlightUseCase,
    private listUseCase: ListHighlightsUseCase,
    private deleteUseCase: DeleteHighlightUseCase,
    private bulkDeleteUseCase: BulkDeleteHighlightsUseCase,
  ) {
    super();
  }

  register() {
    this.router
      .openapi(createHighlightRoute, async (c) => {
        const data = c.req.valid("json");
        const { id: userId } = c.get("user");
        const highlight = await this.createUseCase.execute({ userId, data });
        return c.json(highlight);
      })
      .openapi(getHighlightRoute, async (c) => {
        const id = c.req.param("id");
        const { id: userId } = c.get("user");
        const highlight = await this.getUseCase.execute({ userId, id });
        return c.json(highlight);
      })
      .openapi(updateHighlightRoute, async (c) => {
        const id = c.req.param("id");
        const updates = c.req.valid("json");
        const { id: userId } = c.get("user");
        const highlight = await this.updateUseCase.execute({
          userId,
          id,
          updates,
        });
        return c.json(highlight);
      })
      .openapi(deleteHighlightRoute, async (c) => {
        const id = c.req.param("id");
        const { id: userId } = c.get("user");
        await this.deleteUseCase.execute({ userId, id });
        return new Response(null, { status: 204 });
      })
      .openapi(bulkDeleteHighlightsRoute, async (c) => {
        const { ids } = c.req.valid("json");
        const { id: userId } = c.get("user");
        await this.bulkDeleteUseCase.execute({ ids, userId });
        return new Response(null, { status: 204 });
      })
      .openapi(listHighlightsRoute, async (c) => {
        const { id: userId } = c.get("user");
        const options = c.req.valid("query");
        const highlights = await this.listUseCase.execute({ userId, options });
        const validatedHighlights = HighlightListResponseSchema.parse(
          highlights,
        );
        return c.json(validatedHighlights);
      });

    return this.router;
  }
}
