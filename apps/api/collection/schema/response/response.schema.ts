import { z } from "@hono/zod-openapi";
import { CollectionSchema } from "../collection.schema.ts";

export const CollectionResponseSchema = CollectionSchema;
export const CollectionListResponseSchema = z.array(CollectionSchema);
