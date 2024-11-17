import { z } from "@hono/zod-openapi";

export const CreateHighlightRequestSchema = z.object({
  itemId: z.string(),
  color: z.string(),
  textSelection: z.object({
    start: z.number(),
    end: z.number(),
    selectedText: z.string(),
  }),
  note: z.string().optional(),
});
