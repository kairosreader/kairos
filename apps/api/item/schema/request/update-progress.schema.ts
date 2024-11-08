import { z } from "@hono/zod-openapi";

export const UpdateReadingProgressRequestSchema = z
  .object({
    progress: z.number().min(0).max(100).openapi({
      description: "Reading progress percentage",
      example: 50,
    }),
    lastPosition: z.number().min(0).openapi({
      description: "Last reading position",
      example: 1000,
    }),
  })
  .openapi("UpdateReadingProgressRequest");

export type UpdateReadingProgressRequest = z.infer<
  typeof UpdateReadingProgressRequestSchema
>;
