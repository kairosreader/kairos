import { CreateHighlightRequestSchema } from "./create.schema.ts";

export const UpdateHighlightRequestSchema = CreateHighlightRequestSchema
  .partial().openapi({
    example: {
      color: "#FF0000",
      note: "This is a note",
    },
    description: "Partial update for the highlight",
  });
