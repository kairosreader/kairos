import { z } from "@hono/zod-openapi";
import { dateSchema } from "../../common/schema/date.schema.ts";
import { idSchema, userIdSchema } from "../../common/schema/id.schema.ts";

export const CollectionSchema = z
  .object({
    id: idSchema,
    userId: userIdSchema,
    name: z.string(),
    description: z.string().optional(),
    isDefault: z.boolean(),
    isArchive: z.boolean(),
    color: z.string().optional(),
    icon: z.string().optional(),
    itemCount: z.number(),
    createdAt: dateSchema,
    updatedAt: dateSchema,
  })
  .openapi("Collection");
