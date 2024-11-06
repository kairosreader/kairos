import { z } from "@hono/zod-openapi";

export const ErrorResponseSchema = z
  .object({
    error: z.string(),
  })
  .openapi("ErrorResponse");

export const errorResponses = {
  401: {
    content: {
      "application/json": {
        schema: ErrorResponseSchema,
      },
    },
    description: "Unauthorized",
  },
  404: {
    content: {
      "application/json": {
        schema: ErrorResponseSchema,
      },
    },
    description: "Not found",
  },
  400: {
    content: {
      "application/json": {
        schema: ErrorResponseSchema,
      },
    },
    description: "Bad Request",
  },
} as const;
