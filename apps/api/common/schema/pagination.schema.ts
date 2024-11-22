import { z } from "@hono/zod-openapi";
import type {
  FilterConfig,
  FilterOperator,
  PaginationOptions,
  QueryOptions,
} from "@kairos/shared/types";

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
} as const satisfies Record<FilterOperator, z.ZodType>;

export type FilterFieldConfig = {
  operators: FilterOperator[];
  type?: z.ZodType;
};

export type FilterFieldsConfig<T extends string> = {
  [K in T]: FilterFieldConfig;
};

// Filter operator mapping for query parameter syntax
const filterOperatorMap = {
  eq: "equals",
  neq: "not",
  gt: "gt",
  gte: "gte",
  lt: "lt",
  lte: "lte",
  in: "in",
  nin: "not-in",
  contains: "contains",
  startsWith: "starts-with",
  endsWith: "ends-with",
} as const;

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

export const PageInfoSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("offset"),
      total: z.number().int().min(0).openapi({
        description: "Total number of items matching the query",
        example: 100,
      }),
      page: z.number().int().min(1).openapi({
        description: "Current page number",
        example: 1,
      }),
      pageSize: z.number().int().min(1).openapi({
        description: "Number of items per page",
        example: 20,
      }),
      totalPages: z.number().int().min(1).openapi({
        description: "Total number of pages",
        example: 5,
      }),
      links: z
        .object({
          self: z.string().url().openapi({
            description: "URL of the current page",
            example: "/api/items?page=2&per_page=20",
          }),
          first: z.string().url().openapi({
            description: "URL of the first page",
            example: "/api/items?page=1&per_page=20",
          }),
          prev: z.string().url().optional().openapi({
            description: "URL of the previous page",
            example: "/api/items?page=1&per_page=20",
          }),
          next: z.string().url().optional().openapi({
            description: "URL of the next page",
            example: "/api/items?page=3&per_page=20",
          }),
          last: z.string().url().openapi({
            description: "URL of the last page",
            example: "/api/items?page=5&per_page=20",
          }),
        })
        .openapi({
          description: "HATEOAS navigation links for offset-based pagination",
        }),
    })
    .openapi("OffsetPageInfo"),
  z
    .object({
      type: z.literal("cursor"),
      pageSize: z.number().int().min(1).openapi({
        description: "Number of items per page",
        example: 20,
      }),
      links: z
        .object({
          self: z.string().url().openapi({
            description: "URL of the current page",
            example: "/api/items?cursor=eyJpZCI6MTAwfQ&per_page=20",
          }),
          prev: z.string().url().optional().openapi({
            description: "URL of the previous page",
            example: "/api/items?cursor=eyJpZCI6ODB9&per_page=20",
          }),
          next: z.string().url().optional().openapi({
            description: "URL of the next page",
            example: "/api/items?cursor=eyJpZCI6MTIwfQ&per_page=20",
          }),
        })
        .openapi({
          description: "HATEOAS navigation links for cursor-based pagination",
        }),
    })
    .openapi("CursorPageInfo"),
]);

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
  // Create dynamic filter schemas for each field
  const filterSchemas = Object.entries(filterConfig).reduce<
    Record<string, z.ZodType>
  >((acc, [field, config]) => {
    const fieldSchema: Record<string, z.ZodType> = {};
    const typedConfig = config as FilterFieldConfig;

    typedConfig.operators.forEach((operator: FilterOperator) => {
      const paramKey = `${field}[${filterOperatorMap[operator]}]`;
      const baseValidator = typedConfig.type || filterOperators[operator];
      fieldSchema[paramKey] = baseValidator.optional();
    });
    return { ...acc, ...fieldSchema };
  }, {});

  return z
    .object({
      // Pagination parameters
      page: z.number().int().min(1).optional().openapi({
        description: "Page number (1-based) for offset pagination",
        example: 1,
      }),
      cursor: z.string().optional().openapi({
        description: "Cursor for cursor-based pagination",
        example: "eyJpZCI6MTAwfQ",
      }),
      per_page: z
        .number()
        .int()
        .min(1)
        .max(100)
        .optional()
        .default(20)
        .openapi({
          description: "Number of items per page",
          example: 20,
        }),

      // Sorting using comma-separated values
      sort: z.string().optional().openapi({
        description:
          "Comma-separated list of sort fields (prefix with - for desc)",
        example: "-created_at,title",
      }),

      // Full-text search
      q: z.string().optional().openapi({
        description: "Full-text search query",
        example: "search term",
      }),

      // Dynamic filter fields
      ...filterSchemas,
    })
    .openapi({
      description: "Query parameters for pagination, filtering, and sorting",
    })
    .transform((data) => {
      const { page, cursor, per_page, sort, q, ...filterParams } = data;

      // Parse sort parameter
      const sortParams = sort?.split(",").map((field) => {
        if (field.startsWith("-")) {
          return { field: field.slice(1), direction: "desc" as const };
        }
        return { field, direction: "asc" as const };
      });

      // Validate sort fields
      const validSortParams = sortParams?.filter(({ field }) =>
        sortFields.includes(field as TSortFields[number])
      );

      // Parse filter parameters from bracket notation
      const parsedFilters: FilterConfig<TFilterFields> = {};
      Object.entries(filterParams).forEach(([key, value]) => {
        const matches = key.match(/^([^[]+)\[([^\]]+)\]$/);
        if (matches) {
          const [, field, operator] = matches;
          const fieldKey = field as TFilterFields;

          if (field in filterConfig) {
            const config = filterConfig[fieldKey];
            const operatorKey = Object.entries(filterOperatorMap).find(
              ([, v]) => v === operator,
            )?.[0] as FilterOperator | undefined;

            if (operatorKey && config.operators.includes(operatorKey)) {
              if (!parsedFilters[fieldKey]) {
                parsedFilters[fieldKey] = {};
              }
              parsedFilters[fieldKey]![operatorKey] =
                operator === "in" || operator === "not-in"
                  ? String(value).split(",")
                  : value;
            }
          }
        }
      });

      const pagination: PaginationOptions = cursor
        ? { type: "cursor", cursor, pageSize: per_page }
        : { type: "offset", page: page ?? 1, pageSize: per_page };

      return {
        pagination,
        sort: validSortParams,
        filters: parsedFilters,
        search: q,
      } satisfies QueryOptions<TSortFields[number], TFilterFields>;
    });
};
