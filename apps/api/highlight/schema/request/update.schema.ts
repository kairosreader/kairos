import { z } from "@hono/zod-openapi";
import { enumValuesTuple } from "@kairos/shared/utils";
import { HIGHLIGHT_COLOR } from "@kairos/shared/constants";

export const UpdateHighlightRequestSchema = z
  .object({
    color: z
      .enum(enumValuesTuple(HIGHLIGHT_COLOR))
      .optional()
      .openapi({
        description: "Color of the highlight",
        example: "yellow",
        enum: enumValuesTuple(HIGHLIGHT_COLOR),
      }),
    textSelection: z
      .object({
        start: z.number(),
        end: z.number(),
        selectedText: z.string(),
      })
      .optional(),
    note: z.string().optional(),
  })
  .openapi({
    example: {
      color: "yellow",
      note: "This is a note",
    },
    description: "Partial update for the highlight",
  });
