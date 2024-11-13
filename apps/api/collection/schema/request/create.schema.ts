import { z } from "@hono/zod-openapi";

export const CreateCollectionRequestSchema = z.object({
  name: z.string().openapi({
    example: "Reading List",
    description: "Name of the collection",
  }),
  description: z.string().optional().openapi({
    example: "My main reading list",
    description: "Optional description of the collection",
  }),
  color: z.string().optional().openapi({
    example: "#FF0000",
    description: "Optional color for the collection",
  }),
  icon: z.string().optional().openapi({
    example: "📚",
    description: "Optional icon for the collection",
  }),
});
