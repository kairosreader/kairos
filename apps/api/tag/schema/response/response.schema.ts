import { z } from "@hono/zod-openapi";
import { TagSchema } from "../tag.schema.ts";
import { PageInfoSchema } from "../../../common/schema/pagination.schema.ts";

export const TagResponseSchema = TagSchema.openapi("TagResponse");

export const TagListResponseSchema = z.object({
  items: z.array(TagResponseSchema).openapi({
    description: "List of tags",
  }),
  pageInfo: PageInfoSchema,
})
  .openapi("TagListResponse");
