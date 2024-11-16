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
    description: "Filter operator",
  });

export const createQuerySchema = <
  TSortFields extends [string, ...string[]],
  TFilterFields extends [string, ...string[]],
>({
  sortFields,
  filterFields,
}: {
  sortFields: TSortFields;
  filterFields: TFilterFields;
}) =>
  z
    .object({
      pagination: paginationSchema.optional().default({
        type: "offset",
        page: 1,
        limit: 20,
      }),
      sort: z
        .object({
          field: z.enum(sortFields).optional().default(sortFields[0]).openapi({
            description: "Field to sort by",
            enum: sortFields,
          }),
          direction: z
            .enum(["asc", "desc"])
            .optional()
            .default("desc")
            .openapi({
              description: "Sort direction",
              example: "desc",
            }),
        })
        .optional()
        .default({
          field: sortFields[0],
          direction: "desc",
        }),
      filter: z
        .record(z.enum(filterFields), filterOperatorSchema)
        .optional()
        .openapi({
          description: "Filter criteria",
          enum: filterFields,
          items: {
            type: "object",
            properties: {
              eq: { type: "string" },
              neq: { type: "string" },
              gt: { type: "number" },
              gte: { type: "number" },
              lt: { type: "number" },
              lte: { type: "number" },
              in: { type: "array", items: { type: "string" } },
              nin: { type: "array", items: { type: "string" } },
              contains: { type: "string" },
              startsWith: { type: "string" },
              endsWith: { type: "string" },
            },
          },
        }),
      searchQuery: z.string().optional().openapi({
        description: "Search query",
        example: "search term",
      }),
    })
    .openapi({
      description: "Query parameters for pagination, sorting, and filtering",
    });

export type PaginationSchema = z.infer<typeof paginationSchema>;
export type SortSchema = z.infer<typeof sortSchema>;
export type FilterSchema = z.infer<typeof filterOperatorSchema>;
