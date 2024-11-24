import { z } from "@hono/zod-openapi";
import { idSchema, userIdSchema } from "../../common/schema/id.schema.ts";

export const HighlightSchema = z
  .object({
    id: idSchema,
    userId: userIdSchema,
    itemId: z.string(),
    color: z.string(),
    textSelection: z.object({
      start: z.number(),
      end: z.number(),
      selectedText: z.string(),
    }),
    note: z.string().nullish().transform((val) => val || null),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Highlight");
