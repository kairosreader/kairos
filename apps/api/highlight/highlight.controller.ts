import { BaseController } from "../common/controller/base.controller.ts";
import type {
  CreateHighlightUseCase,
  DeleteHighlightUseCase,
  GetHighlightUseCase,
  ListHighlightsUseCase,
  UpdateHighlightUseCase,
} from "@kairos/core/highlight/usecases";
import {
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
  ) {
    super();
  }

  register() {
    this.router
      .openapi(createHighlightRoute, async (c) => {
        const data = c.req.valid("json");
        const userId = c.get("userId");
        const highlight = await this.createUseCase.execute({ userId, data });
        return c.json(highlight);
      })
      .openapi(getHighlightRoute, async (c) => {
        const id = c.req.param("id");
        const userId = c.get("userId");
        const highlight = await this.getUseCase.execute({ userId, id });
        return c.json(highlight);
      })
      .openapi(updateHighlightRoute, async (c) => {
        const id = c.req.param("id");
        const updates = c.req.valid("json");
        const userId = c.get("userId");
        const highlight = await this.updateUseCase.execute({
          userId,
          id,
          updates,
        });
        return c.json(highlight);
      })
      .openapi(deleteHighlightRoute, async (c) => {
        const id = c.req.param("id");
        const userId = c.get("userId");
        await this.deleteUseCase.execute({ userId, id });
        return c.json(null, 204);
      })
      .openapi(listHighlightsRoute, async (c) => {
        const userId = c.get("userId");
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
