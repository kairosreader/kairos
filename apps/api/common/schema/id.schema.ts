import { z } from "@hono/zod-openapi";

export const idSchema = z.string().openapi({
  param: {
    name: "id",
    in: "path",
    required: true,
  },
  example: "123e4567-e89b-12d3-a456-426614174000",
  description: "Item ID",
});

export const userIdSchema = z.string().openapi({
  example: "user123",
});
