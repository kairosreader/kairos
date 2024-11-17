import { z } from "@hono/zod-openapi";

// Filter operator types
export const filterOperators = {
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
} as const;

export type FilterOperator = keyof typeof filterOperators;

export type FilterFieldConfig = {
  operators: FilterOperator[];
  type?: z.ZodType;
};

export type FilterFieldsConfig<T extends string> = {
  [K in T]: FilterFieldConfig;
};

export const createFilterSchema = (
  field: string,
  config: FilterFieldConfig,
) => {
  const schema: Record<string, z.ZodType> = {};

  config.operators.forEach((operator) => {
    const baseValidator = config.type || filterOperators[operator];
    schema[`${field}.${operator}`] = baseValidator.openapi({
      description: `${operator} operator for ${field}`,
    });
  });

  return z.object(schema).partial();
};

export const createQuerySchema = <
  TSortFields extends [string, ...string[]],
  TFilterFields extends string,
>({
  sortFields,
  filterConfig,
}: {
  sortFields: TSortFields;
  filterConfig: FilterFieldsConfig<TFilterFields>;
}) => {
  // Create filter schema by combining all field filters
  const filterSchema = Object.entries(filterConfig).reduce(
    (acc, [field, config]) => {
      return acc.merge(createFilterSchema(field, config as FilterFieldConfig));
    },
    z.object({}),
  );

  return z
    .object({
      // Pagination parameters
      page: z.number().int().min(1).optional().default(1).openapi({
        description: "Page number",
        example: 1,
      }),
      limit: z.number().int().min(1).max(100).optional().default(20).openapi({
        description: "Items per page",
        example: 20,
      }),
      cursor: z.string().optional().openapi({
        description: "Cursor for pagination",
        example: "eyJpZCI6IjEyMyJ9",
      }),
      type: z.enum(["offset", "cursor"]).default("offset").openapi({
        description: "Pagination type",
        example: "offset",
      }),

      // Sorting parameters
      sort_field: z.enum(sortFields).optional().default(sortFields[0]).openapi({
        description: "Field to sort by",
        enum: sortFields,
      }),
      sort_direction: z
        .enum(["asc", "desc"])
        .optional()
        .default("desc")
        .openapi({
          description: "Sort direction",
          example: "desc",
        }),

      // Filtering
      ...filterSchema.shape,

      // Search
      searchQuery: z.string().optional().openapi({
        description: "Search query",
        example: "search term",
        "x-tagGroups": "Search",
      }),
    })
    .openapi({
      description: "Query parameters for pagination, sorting, and filtering",
    });
};
