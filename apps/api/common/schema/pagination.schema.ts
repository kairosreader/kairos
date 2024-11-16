import { z } from "@hono/zod-openapi";

const offsetPaginationSchema = z.object({
  type: z.literal("offset"),
  page: z.number().int().min(1).optional().default(1).openapi({
    description: "Page number",
    example: 1,
  }),
  limit: z.number().int().min(1).max(100).optional().default(20).openapi({
    description: "Items per page",
    example: 20,
  }),
});

const cursorPaginationSchema = z.object({
  type: z.literal("cursor"),
  cursor: z.string().optional().openapi({
    description: "Cursor for pagination",
    example: "eyJpZCI6IjEyMyJ9",
  }),
  limit: z.number().int().min(1).max(100).optional().default(20).openapi({
    description: "Items per page",
    example: 20,
  }),
});

export const paginationSchema = z.discriminatedUnion("type", [
  offsetPaginationSchema,
  cursorPaginationSchema,
]);

export const sortSchema = z.object({
  field: z.string().openapi({
    description: "Field to sort by",
    example: "createdAt",
  }),
  direction: z.enum(["asc", "desc"]).optional().default("desc").openapi({
    description: "Sort direction",
    example: "desc",
  }),
});

export const filterOperatorSchema = z
  .object({
    eq: z.any().optional(),
    neq: z.any().optional(),
    gt: z.union([z.number(), z.date()]).optional(),
    gte: z.union([z.number(), z.date()]).optional(),
    lt: z.union([z.number(), z.date()]).optional(),
    lte: z.union([z.number(), z.date()]).optional(),
    in: z.array(z.any()).optional(),
    nin: z.array(z.any()).optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
  })
  .openapi({
    description: "Filter operators",
    example: { eq: "value" },
  });

export const filterSchema = filterOperatorSchema.openapi({
  description: "Filter options",
  example: { eq: "READY" },
});

export type PaginationSchema = z.infer<typeof paginationSchema>;
export type SortSchema = z.infer<typeof sortSchema>;
export type FilterSchema = z.infer<typeof filterSchema>;
