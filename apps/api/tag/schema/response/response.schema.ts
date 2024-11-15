import { z } from "@hono/zod-openapi";
import { TagSchema } from "../tag.schema.ts";

export const TagResponseSchema = TagSchema.openapi("TagResponse");

export const TagListResponseSchema = z
  .array(TagSchema)
  .openapi("TagListResponse");
