import { z } from "@hono/zod-openapi";

export const UpdateCollectionRequestSchema = z.object({
  name: z.string().openapi({
    example: "Updated Reading List",
    description: "New name for the collection",
  }),
  description: z.string().optional().openapi({
    example: "Updated description",
    description: "New description for the collection",
  }),
  color: z.string().optional().openapi({
    example: "#00FF00",
    description: "New color for the collection",
  }),
  icon: z.string().optional().openapi({
    example: "📖",
    description: "New icon for the collection",
  }),
});
