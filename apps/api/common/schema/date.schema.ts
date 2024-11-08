import { z } from "@hono/zod-openapi";

export const dateSchema = z
  .union([z.string().datetime(), z.date()])
  .transform((val) => (val instanceof Date ? val : new Date(val)))
  .openapi({
    type: "string",
    format: "date-time",
    example: "2024-01-01T00:00:00Z",
  });

export const serializedDateSchema = dateSchema.transform((date) =>
  date.toISOString(),
);
export const optionalSerializedDateSchema = serializedDateSchema.optional();
