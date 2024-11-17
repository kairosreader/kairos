import { z } from "@hono/zod-openapi";
import { HighlightSchema } from "../highlight.schema.ts";
import { PageInfoSchema } from "../../../common/schema/pagination.schema.ts";

export const HighlightResponseSchema = HighlightSchema.openapi(
  "HighlightResponse",
);

export const HighlightListResponseSchema = z
  .object({
    items: z.array(HighlightResponseSchema).openapi({
      description: "List of highlights",
    }),
    pageInfo: PageInfoSchema,
  })
  .openapi("HighlightListResponse");
