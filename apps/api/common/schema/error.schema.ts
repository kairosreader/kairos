import { z } from "@hono/zod-openapi";

export const ErrorResponseSchema = z
  .object({
    error: z.string(),
    code: z.string().optional(),
    details: z.unknown().optional(),
  })
  .openapi("ErrorResponse");

export const createErrorResponse = (description: string) => ({
  content: {
    "application/json": {
      schema: ErrorResponseSchema,
    },
  },
  description,
});

export const standardErrorResponses = {
  401: createErrorResponse("Unauthorized"),
  404: createErrorResponse("Not found"),
  400: createErrorResponse("Bad Request"),
} as const;
