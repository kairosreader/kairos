import { z } from "@hono/zod-openapi";
import { idSchema } from "../../../common/schema/id.schema.ts";

export const TagItemRequestSchema = z.object({
  itemId: idSchema.openapi({
    description: "ID of the item to tag",
  }),
  tagIds: z.array(idSchema).openapi({
    description: "IDs of the tags to apply",
    example: ["tag-1", "tag-2"],
  }),
});

export const BulkTagRequestSchema = z.object({
  itemIds: z.array(idSchema).openapi({
    description: "IDs of the items to tag",
    example: ["item-1", "item-2"],
  }),
  tagIds: z.array(idSchema).openapi({
    description: "IDs of the tags to apply",
    example: ["tag-1", "tag-2"],
  }),
});

export const MergeTagsRequestSchema = z.object({
  sourceTagId: idSchema.openapi({
    description: "ID of the source tag to merge from",
  }),
  targetTagId: idSchema.openapi({
    description: "ID of the target tag to merge into",
  }),
});
