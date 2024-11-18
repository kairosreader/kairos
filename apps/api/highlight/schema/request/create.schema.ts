import { z } from "@hono/zod-openapi";
import { enumValuesTuple } from "@kairos/shared/utils";
import { HIGHLIGHT_COLOR } from "@kairos/shared/constants";

export const CreateHighlightRequestSchema = z.object({
  itemId: z.string(),
  color: z.enum(enumValuesTuple(HIGHLIGHT_COLOR)).openapi({
    description: "Color of the highlight",
    example: "yellow",
    enum: enumValuesTuple(HIGHLIGHT_COLOR),
  }),
  textSelection: z.object({
    start: z.number(),
    end: z.number(),
    selectedText: z.string(),
  }),
  note: z.string().optional(),
});
