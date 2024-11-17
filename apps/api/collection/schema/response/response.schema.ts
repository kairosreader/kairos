import { z } from "@hono/zod-openapi";
import { CollectionSchema } from "../collection.schema.ts";
import { PageInfoSchema } from "../../../common/schema/pagination.schema.ts";

export const CollectionResponseSchema = CollectionSchema.openapi(
  "CollectionResponse",
);

export const CollectionListResponseSchema = z
  .object({
    items: z.array(CollectionResponseSchema).openapi({
      description: "List of collections",
    }),
    pageInfo: PageInfoSchema,
  })
  .openapi("CollectionListResponse");
