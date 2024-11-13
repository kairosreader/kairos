import { z } from "@hono/zod-openapi";
import {
  paginationSchema,
  sortSchema,
} from "../../../common/schema/pagination.schema.ts";

export const ListCollectionsQuerySchema = z
  .object({
    ...paginationSchema.shape,
    ...sortSchema.shape,
    sortBy: z.enum(["name", "createdAt", "itemCount"]).optional().openapi({
      description: "Field to sort by",
      example: "createdAt",
    }),
    search: z.string().optional().openapi({
      description: "Search collections by name",
      example: "reading",
    }),
    // Can add more collection-specific filters here
    isArchived: z.boolean().optional().openapi({
      description: "Filter by archive status",
      example: false,
    }),
  })
  .openapi("ListCollectionsQuery");

export type ListCollectionsQuery = z.infer<typeof ListCollectionsQuerySchema>;
