import { z } from "@hono/zod-openapi";

export const paginationSchema = z.object({
  page: z.number().int().min(1).optional().openapi({
    description: "Page number",
    example: 1,
  }),
  limit: z.number().int().min(1).max(100).optional().openapi({
    description: "Items per page",
    example: 20,
  }),
});

export const sortSchema = z.object({
  order: z.enum(["asc", "desc"]).optional().openapi({
    description: "Sort order",
    example: "desc",
  }),
});
