import { z } from "@hono/zod-openapi";

export const dateSchema = z
  .string()
  .datetime()
  .transform((str: string) => new Date(str))
  .openapi({
    example: "2024-01-01T00:00:00Z",
    description: "ISO 8601 date string",
  });

export const timestampSchema = dateSchema.default(new Date().toISOString());

export const urlSchema = z.string().url();
